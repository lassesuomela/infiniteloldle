const axios = require("axios");
const semver = require("semver");
const cheerio = require("cheerio");
const fsp = require("fs").promises;
const pLimit = require("p-limit");
const path = require("path");
const sharp = require("sharp");

const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const championV2 = require("../models/v2/champion");

const DDRAGON_BASE = "https://ddragon.leagueoflegends.com";
const BASE_UNIVERSE_MEEPS_URL = "https://universe-meeps.leagueoflegends.com";
const BASE_UNIVERSE_URL = "https://universe.leagueoflegends.com";
const WIKI_BASE_URL = "https://wiki.leagueoflegends.com";
const CDRAGON_BASE = "https://raw.communitydragon.org";

const MALE_WORDS = ["he", "him", "his"];
const FEMALE_WORDS = ["she", "her", "hers"];

const RANGE_LIMIT = 350; // Range limit to determine melee/ranged

function getChampionRangeType(range) {
  return range >= RANGE_LIMIT ? "Ranged" : "Melee";
}

function normalizeToken(token) {
  return token
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}']/gu, "")
    .toLowerCase()
    .trim();
}

function countGenderTokens(tokens) {
  let male = 0;
  let female = 0;

  for (const token of tokens) {
    const word = normalizeToken(token);
    if (!word) continue;
    if (MALE_WORDS.includes(word)) male++;
    if (FEMALE_WORDS.includes(word)) female++;
  }
  return { male, female };
}

function computeMalePercentage({ male, female }) {
  const total = male + female;
  return total > 0 ? male / total : null;
}

async function determineGenderFromLore(championId) {
  try {
    const loreUrl = `${BASE_UNIVERSE_MEEPS_URL}/v1/en_us/champions/${championId.toLowerCase()}/index.json`;
    const loreResponse = await axios.get(loreUrl);

    const { full, short } = loreResponse.data.champion.biography;

    const fullTokens = full.toLowerCase().split(/\s+/);
    const shortTokens = short.toLowerCase().split(/\s+/);

    const fullCounts = countGenderTokens(fullTokens);
    const shortCounts = countGenderTokens(shortTokens);

    const fullMalePct = computeMalePercentage(fullCounts);
    const shortMalePct = computeMalePercentage(shortCounts);

    let chosenCounts;
    let source;

    if (shortMalePct === null && fullMalePct === null) {
      chosenCounts = { male: 0, female: 0 };
      source = "none";
    } else if (shortMalePct !== null && fullMalePct === null) {
      chosenCounts = shortCounts;
      source = "short-only";
    } else if (shortMalePct === null && fullMalePct !== null) {
      chosenCounts = fullCounts;
      source = "full-only";
    } else {
      const diff = Math.abs(shortMalePct - fullMalePct);
      if (diff > 0.1) {
        chosenCounts = shortCounts;
        source = "short-preferred";
      } else {
        chosenCounts = {
          male: shortCounts.male + fullCounts.male,
          female: shortCounts.female + fullCounts.female,
        };
        source = "combined";
      }
    }

    let gender = 0; // unknown
    if (source !== "none") {
      if (chosenCounts.male > chosenCounts.female) gender = 1;
      else if (chosenCounts.female > chosenCounts.male) gender = 2;
      else gender = 3; // ambiguous
    }

    return {
      gender,
      source,
      maleCount: chosenCounts.male,
      femaleCount: chosenCounts.female,
    };
  } catch (error) {
    console.error("Error fetching champion lore:", error.message);
    return { gender: 0, error: error.message };
  }
}

async function fetchLatestPatch() {
  const patchResponse = await axios.get(DDRAGON_BASE + "/api/versions.json");
  const versions = patchResponse.data;
  if (!versions.length) throw new Error("No patch versions found.");
  return versions[0];
}

async function fetchChampionsForPatch(version) {
  const championsUrl = `${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`;
  const championsResponse = await axios.get(championsUrl);
  const championsMap = championsResponse.data.data;
  return Object.values(championsMap);
}

function findMissingChampions(latestChampions, existingChampions) {
  const existingKeys = existingChampions.map((champ) =>
    champ.championKey.toLowerCase()
  );
  return latestChampions.filter(
    (champ) => !existingKeys.includes(champ.id.toLowerCase())
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getChampionRolesMap(missingChampions) {
  const url =
    CDRAGON_BASE +
    "/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";

  try {
    const response = await axios.get(url);
    const champions = response.data;

    // Build a lookup map by champion id
    const championById = {};
    for (const champ of champions) {
      championById[champ.alias] = champ;
    }

    const championRolesMap = {};

    for (const missingChampName of missingChampions) {
      const champData = championById[missingChampName];
      if (champData && Array.isArray(champData.roles)) {
        championRolesMap[missingChampName] =
          champData.roles.map(capitalize) || [];
      }
    }

    return championRolesMap;
  } catch (error) {
    console.error("Failed to fetch champion data:", error.message);
    return {};
  }
}

async function scrapeChampionWikiData(championId) {
  const wikiUrl = `${WIKI_BASE_URL}/en-us/${encodeURIComponent(championId)}`;

  try {
    const req = await axios.get(wikiUrl);
    const $ = cheerio.load(req.data);
    let damageType = "";
    const positions = [];

    $('a[title="Adaptive force"]').each((_, el) => {
      const text = $(el).text().trim();
      if (text) damageType = text;
    });

    return { positions, damageType };
  } catch (error) {
    console.error(`Error scraping wiki data for ${championId}:`, error.message);
    return { positions: [], damageType: "" };
  }
}

async function getFactionsAndChampions() {
  try {
    const url = `${BASE_UNIVERSE_MEEPS_URL}/v1/en_us/search/index.json`;

    const { data } = await axios.get(url);

    const factions = {};
    const championsByName = {};

    for (const faction of data.factions) {
      factions[faction.slug] = {
        slug: faction.slug,
        name: faction.name,
      };
    }

    console.log(factions);

    for (const champion of data.champions) {
      championsByName[champion.slug] = {
        name: champion.name,
        slug: champion.slug,
        faction: {
          slug: champion["associated-faction-slug"],
          name: factions[champion["associated-faction-slug"]]
            ? factions[champion["associated-faction-slug"]].name
            : null,
        },
        "release-date": champion["release-date"] || null,
      };
    }

    return { factions, championsByName };
  } catch (err) {
    console.error("Failed to fetch or parse:", err.message);
    return { factions: [], championsByName: {} };
  }
}

async function buildChampionPayload(
  champion,
  version,
  championRoles,
  championFactions
) {
  try {
    const detailUrl = `${DDRAGON_BASE}/cdn/${version}/data/en_US/champion/${champion.id}.json`;
    const detailResponse = await axios.get(detailUrl);

    const skins = detailResponse.data.data[champion.id].skins.map((skin) => ({
      id: skin.id,
      name: skin.name,
      num: skin.num,
    }));

    const genderInfo = await determineGenderFromLore(champion.id);

    const wikiData = await scrapeChampionWikiData(champion.id);

    return {
      championId: champion.id,
      name: champion.name,
      title: champion.title,
      rangeType: getChampionRangeType(champion.stats.attackrange),
      resource: champion.partype,
      skins,
      gender: genderInfo.gender,
      positions: wikiData.positions,
      damageType: wikiData.damageType,
      roles: championRoles,
      region: championFactions.faction.name || null,
      releaseDate: championFactions["release-date"] || null,
    };
  } catch (error) {
    console.error(
      `Error building payload for champion ${champion.id}:`,
      error.message
    );
    return null;
  }
}

async function fetchPngBuffer(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}

async function ensureDir(dirPath) {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}: ${error.message}`);
    return false;
  }
}

async function saveBuffer(filePath, buffer) {
  await fsp.writeFile(filePath, buffer);
}

async function convertImagesToWebp(inputDir, options) {
  const files = await fsp.readdir(inputDir);
  const webpFiles = files.filter(
    (file) => file.endsWith(".png") || file.endsWith(".jpg")
  );

  const limit = pLimit(4);
  const tasks = webpFiles.map((file) =>
    limit(async () => {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(
        inputDir,
        file.replace(/\.(png|jpg)$/, ".webp")
      );
      try {
        await sharp(inputPath).webp(options).toFile(outputPath);
        console.log(`Converted ${file} to webp`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err.message);
      }
    })
  );

  await Promise.all(tasks);
  console.log(`Converted ${webpFiles.length} images to webp format.`);

  webpFiles.forEach((file) => {
    const inputPath = path.join(inputDir, file);
    fsp.unlink(inputPath).catch((err) => {
      console.error(`Failed to delete original file ${file}:`, err.message);
    });
  });
  console.log(`Deleted original files in ${inputDir}.`);
}

async function downloadChampionAsset(url, championName, outputDir, ext) {
  const savePath = path.join(outputDir, `${championName}.${ext}`);

  try {
    const png = await fetchPngBuffer(url);
    await saveBuffer(savePath, png);
    return { championName, ok: true };
  } catch (err) {
    console.log(
      `fail ${championName} (${err.response?.status || err.message})`
    );
    return { championName, ok: false, error: err };
  }
}

async function downloadBulkChampionImages(
  version,
  missingChampNames,
  championPayloads,
  outputDir,
  concurrency = 4
) {
  console.log("Downloading champion images");

  const splashdir = path.join(outputDir, "splash");
  const icondir = path.join(outputDir, "icons");

  await ensureDir(splashdir);
  await ensureDir(icondir);

  const limit = pLimit(concurrency);

  const championUrls = missingChampNames.map((champion) => ({
    name: champion,
    iconUrl: `${DDRAGON_BASE}/cdn/${version}/img/champion/${champion}.png`,
    splashes:
      championPayloads
        .find((c) => c.championId.toLowerCase() === champion.toLowerCase())
        ?.skins.map((skin) => ({
          name: skin.name,
          num: skin.num,
          url: `${DDRAGON_BASE}/cdn/img/champion/splash/${champion}_${skin.num}.jpg`,
        })) || [],
  }));

  const tasks = championUrls.flatMap((champion) => [
    // Icon download
    limit(() =>
      downloadChampionAsset(champion.iconUrl, champion.name, icondir, "png")
    ),
    // Splash downloads
    ...champion.splashes.map((splash) =>
      limit(() =>
        downloadChampionAsset(
          splash.url,
          `${champion.name}_${splash.num}`,
          splashdir,
          "jpg"
        )
      )
    ),
  ]);

  const results = await Promise.all(tasks);
  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.length - succeeded;
  return { total: results.length, succeeded, failed, results };
}

async function saveLatestPatch() {
  try {
    const latestPatch = await fetchLatestPatch();
    console.log("Latest patch version:", latestPatch);

    const existingPatch = await prisma.lol_patches.findUnique({
      where: { version: latestPatch },
    });
    if (existingPatch) {
      console.log("Patch already exists:", latestPatch);
      return;
    }

    const latestChampions = await fetchChampionsForPatch(latestPatch);
    const existingChampions = await championV2.findAllNamesAndKeys();

    const missingChampions = findMissingChampions(
      latestChampions,
      existingChampions
    );
    console.log(
      `${missingChampions.length} champions missing:`,
      missingChampions.map((c) => c.id)
    );

    const missingChampNames = missingChampions.map((champ) => champ.id);
    const championRolesMap = await getChampionRolesMap(missingChampNames);

    const { factions, championsByName } = await getFactionsAndChampions();

    const championPayloads = [];
    for (const champ of missingChampions) {
      const payload = await buildChampionPayload(
        champ,
        latestPatch,
        championRolesMap[champ.id] || [],
        championsByName[champ.id.toLowerCase()] || []
      );
      championPayloads.push(payload);
    }

    const downloadResult = await downloadBulkChampionImages(
      latestPatch,
      missingChampNames,
      championPayloads,
      "./images/champions"
    );

    console.log(
      `Downloaded ${downloadResult.succeeded} champion images, ${downloadResult.failed} failed.`
    );

    // Convert images to webp format and delete originals
    await convertImagesToWebp("./images/champions/icons", { lossless: true });
    await convertImagesToWebp("./images/champions/splash", { quality: 90 });

    console.log(championPayloads);
    // TODO: Save champions and patch in DB
    console.log("Saving patch:", latestPatch);
  } catch (err) {
    console.error("Error in saveLatestPatch:", err);
  } finally {
    await prisma.$disconnect();
  }
}
// TODO: Create new function. This function should be called periodically to keep the champions data up to date
// It should only fetch new champion skins and splash arts to keep them up to date
saveLatestPatch();
