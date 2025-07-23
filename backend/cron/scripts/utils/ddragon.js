const axios = require("axios");
const fsp = require("fs").promises;
const pLimit = require("p-limit");
const path = require("path");
const sharp = require("sharp");

const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();
const championV2 = require("../../../models/v2/champion");

const DDRAGON_BASE = "https://ddragon.leagueoflegends.com";
const BASE_UNIVERSE_MEEPS_URL = "https://universe-meeps.leagueoflegends.com";
const CDRAGON_BASE = "https://raw.communitydragon.org";
const CDN_CDRAGON_BASE = "https://cdn.communitydragon.org";

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

    factions["unaffiliated"] = {
      slug: "unaffiliated",
      name: "Runeterra",
    };

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

async function getAllChampionDetails() {
  const URL =
    "https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json";

  try {
    const response = await axios.get(URL);
    const champions = response.data;

    const championDetails = {};
    for (const champId of Object.keys(champions)) {
      const champ = champions[champId];
      championDetails[champ.key] = {
        name: champ.name,
        attackType: champ.attackType,
        adaptiveType: champ.adaptiveType,
        positions: champ.positions || [],
        abilities: extractAbilities(champ.abilities),
      };
    }
    return championDetails;
  } catch (error) {
    console.error("Error fetching champion details:", error.message);
    return {};
  }
}

function extractAbilities(abilities) {
  const keys = ["P", "Q", "W", "E", "R"];
  const simplified = {};

  // Just get the first ability for each key
  // This is because some champions have multiple abilities but we only care of the first one
  for (const key of keys) {
    if (abilities[key] && abilities[key][0]) {
      simplified[key] = {
        name: abilities[key][0].name,
        icon: abilities[key][0].icon,
        key,
      };
    }
  }

  return simplified;
}

async function buildChampionPayload(
  champion,
  version,
  championRoles,
  championFactions,
  championDetails
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

    const damageMap = {
      PHYSICAL_DAMAGE: "Physical",
      MAGIC_DAMAGE: "Magic",
      MIXED_DAMAGE: "Physical,Magic",
    };

    const positionMap = {
      TOP: "Top",
      JUNGLE: "Jungle",
      MIDDLE: "Middle",
      MID: "Middle",
      BOTTOM: "Bottom",
      BOT: "Bottom",
      SUPPORT: "Support",
    };

    const positions = championDetails.positions.map((pos) => positionMap[pos]);

    return {
      championId: champion.id,
      name: champion.name,
      title: champion.title,
      rangeType: getChampionRangeType(champion.stats.attackrange),
      resource: champion.partype,
      skins,
      gender: genderInfo.gender,
      positions,
      roles: championRoles,
      damageType: damageMap[championDetails.adaptiveType],
      region: championFactions.faction.name || null,
      releaseDate: championFactions["release-date"] || null,
      abilities: championDetails.abilities,
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

async function resizeChampionIcons() {
  const iconsDir = path.join("./images/champions/icons");
  const resizedDir = path.join("./images/40_40/champions");
  try {
    await ensureDir(resizedDir);

    const files = await fsp.readdir(iconsDir);
    const webpFiles = files.filter((file) => file.endsWith(".webp"));
    const limit = pLimit(4);
    const tasks = webpFiles.map((file) =>
      limit(async () => {
        const inputPath = path.join(iconsDir, file);
        const outputPath = path.join(resizedDir, file);
        try {
          await sharp(inputPath)
            .resize(40, 40, { fit: "inside" })
            .toFile(outputPath);
        } catch (err) {
          console.error(`Failed to resize ${file}:`, err.message);
        }
      })
    );
    await Promise.all(tasks);
    console.log("Champion icons resized to 40x40.");
  } catch (err) {
    console.error("Failed to resize champion icons:", err.message);
  }
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

function buildChampionSplashUrls(champion, skins) {
  return skins.map((s) => ({
    name: s.name,
    num: s.num,
    url: `${DDRAGON_BASE}/cdn/img/champion/splash/${champion}_${s.num}.jpg`,
  }));
}

function buildChampionAbilityUrls(champion, abilities) {
  return abilities.map((a) => ({
    ...a,
    url: `${CDN_CDRAGON_BASE}/latest/champion/${champion}/ability-icon/${a.key.toLowerCase()}`,
  }));
}

function buildChampionUrls(missingChampNames, championPayloads, version) {
  const byName = new Map(
    championPayloads.map((p) => [p.championId.toLowerCase(), p])
  );

  return missingChampNames.map((champion) => {
    const payload = byName.get(champion.toLowerCase());

    return {
      name: champion,
      iconUrl: `${DDRAGON_BASE}/cdn/${version}/img/champion/${champion}.png`,
      splashes: payload ? buildChampionSplashUrls(champion, payload.skins) : [],
      abilities: payload
        ? buildChampionAbilityUrls(champion, Object.values(payload.abilities))
        : [],
    };
  });
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
  const abilityDir = path.join(outputDir, "abilities");

  await ensureDir(splashdir);
  await ensureDir(icondir);
  await ensureDir(abilityDir);

  const limit = pLimit(concurrency);

  const championUrls = buildChampionUrls(
    missingChampNames,
    championPayloads,
    version
  );

  const tasks = championUrls.flatMap((champion) => {
    const abilitiesArray = Object.values(champion.abilities).flat();

    return [
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

      // Ability icons download
      ...abilitiesArray.map((ability) =>
        limit(() =>
          downloadChampionAsset(
            ability.icon,
            `${champion.name}_${ability.key}`,
            abilityDir,
            "png"
          )
        )
      ),
    ];
  });

  const results = await Promise.all(tasks);
  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.length - succeeded;
  return { total: results.length, succeeded, failed, results };
}

async function getLatestPatchIfNew() {
  const latestPatch = await fetchLatestPatch();
  console.log("Latest patch version:", latestPatch);

  const existingPatch = await prisma.lol_patches.findUnique({
    where: { version: latestPatch },
  });

  if (existingPatch) {
    console.log("Patch already exists:", latestPatch);
    return null;
  }

  return latestPatch;
}

async function getMissingChampions(latestPatch) {
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

  return missingChampions;
}

async function buildMissingChampionPayloads(missingChampions, latestPatch) {
  const missingChampNames = missingChampions.map((champ) => champ.id);
  const championRolesMap = await getChampionRolesMap(missingChampNames);
  const { championsByName } = await getFactionsAndChampions();
  const championDetails = await getAllChampionDetails();

  const championPayloads = [];
  for (const champ of missingChampions) {
    const payload = await buildChampionPayload(
      champ,
      latestPatch,
      championRolesMap[champ.id] || [],
      championsByName[champ.id.toLowerCase()] || [],
      championDetails[champ.id] || {}
    );
    championPayloads.push(payload);
  }

  return championPayloads;
}

async function processChampionImages(latestPatch, championPayloads) {
  const missingChampNames = championPayloads.map((p) => p.championId);

  const downloadResult = await downloadBulkChampionImages(
    latestPatch,
    missingChampNames,
    championPayloads,
    "./images/champions"
  );

  console.log(
    `Downloaded ${downloadResult.succeeded} champion images, ${downloadResult.failed} failed.`
  );

  await convertImagesToWebp("./images/champions/icons", { lossless: true });
  await convertImagesToWebp("./images/champions/splash", { quality: 90 });
  await convertImagesToWebp("./images/champions/abilities", { lossless: true });
  await resizeChampionIcons();
}

async function saveChampionsAndPatch(championPayloads, latestPatch) {
  console.log("Saving champions and patch to database...");
  await prisma.$transaction(async (tx) => {
    for (const payload of championPayloads) {
      const champion = await tx.champions.create({
        data: {
          championKey: payload.championId,
          name: payload.name,
          title: payload.title,
          rangeType: payload.rangeType,
          resource: payload.resource,
          gender: payload.gender,
          position: payload.positions.join(","),
          damageType: payload.damageType,
          region: payload.region,
          released: payload.releaseDate.slice(0, 4),
          skinCount: payload.skins.length,
          genre: payload.roles.join(","),
          spriteIds: payload.skins.map((s) => s.num).join(","),
        },
      });

      if (payload.abilities) {
        await tx.abilities.createMany({
          data: Object.values(payload.abilities).map((a) => ({
            championId: champion.id,
            name: a.name,
            key: a.key,
          })),
        });
      }

      if (payload.skins) {
        await tx.skins.createMany({
          data: payload.skins.map((skin) => ({
            championId: champion.id,
            name: skin.name,
            key: skin.num.toString(),
          })),
        });
      }
    }

    await tx.lol_patches.create({ data: { version: latestPatch } });
    console.log("Champions and patch saved successfully.");
  });
}

async function copyFiles(srcDir, destDir) {
  try {
    await ensureDir(destDir);
    const files = await fsp.readdir(srcDir);
    const webpFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".webp")
    );
    const copyTasks = webpFiles.map((file) =>
      fsp.copyFile(path.join(srcDir, file), path.join(destDir, file))
    );
    await Promise.all(copyTasks);
    console.log(
      `Copied ${webpFiles.length} .webp files from ${srcDir} to ${destDir}.`
    );
  } catch (err) {
    console.error(
      `Failed to copy files from ${srcDir} to ${destDir}:`,
      err.message
    );
  }
  return true;
}

/**
 * Save missing champions, skins and abilities to the database.
 * It fetches the latest patch, checks for missing champions,
 * builds their payloads, downloads images, converts them to webp,
 * resizes icons, and saves everything to the database.
 */
async function saveNewChampions() {
  try {
    const latestPatch = await getLatestPatchIfNew();
    if (!latestPatch) return;

    const missingChampions = await getMissingChampions(latestPatch);
    if (missingChampions.length === 0) {
      console.log("No new champions to save.");
      return;
    }

    const championPayloads = await buildMissingChampionPayloads(
      missingChampions,
      latestPatch
    );

    await processChampionImages(latestPatch, championPayloads);

    // Move splash arts to the correct directory for backend usage
    await copyFiles("./images/champions/splash", "./images/splash_arts");
    await copyFiles("./images/champions/abilities", "./images/abilities");

    // Copy images to frontend public directory
    await copyFiles(
      "./images/champions/splash",
      "../frontend/public/splash_arts"
    );
    await copyFiles(
      "./images/40_40/champions",
      "../frontend/public/40_40/champions"
    );

    await copyFiles("./images/champions/icons", "../frontend/public/champions");
    await copyFiles(
      "./images/champions/abilities",
      "../frontend/public/abilities"
    );

    await saveChampionsAndPatch(championPayloads, latestPatch);

    console.log("Completed champion sync for patch:", latestPatch);
  } catch (err) {
    console.error("Error in saveMissingChampions:", err);
    return 1;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Fetch new skins for champions.
 * This function should be called periodically to keep the skins data up to date.
 */
async function saveNewSkins() {
  const limit = pLimit(2); // limit concurrency to 2 tasks at a time

  const latestPatch = await fetchLatestPatch();
  console.log("Latest patch version:", latestPatch);

  const existingSkins = await prisma.skins.findMany({
    select: {
      championId: true,
      name: true,
      champion: {
        select: { championKey: true },
      },
    },
  });

  const existingSkinSet = new Set(
    existingSkins.map((skin) => `${skin.champion.championKey}-${skin.name}`)
  );

  const champions = await fetchChampionsForPatch(latestPatch);

  const championRecords = await championV2.findAll();

  const imgDir = path.join("./images/champions/splash");
  await ensureDir(imgDir);

  // Download new skins and convert them to webp
  for (const champion of champions) {
    const skinsUrl = `${DDRAGON_BASE}/cdn/${latestPatch}/data/en_US/champion/${champion.id}.json`;
    const response = await axios.get(skinsUrl);
    const skins = response.data.data[champion.id].skins;

    console.log(`Processing skins for champion: ${champion.id}`);

    const missingSkins = skins.filter((skin) => {
      const skinKey = `${champion.id}-${skin.name}`;

      return !existingSkinSet.has(skinKey);
    });

    if (missingSkins.length === 0) {
      console.log(`No new skins for champion: ${champion.id}`);
      continue;
    }

    const missingSkinUrls = buildChampionSplashUrls(champion.id, missingSkins);

    // Create a list of throttled download tasks
    const downloadTasks = missingSkinUrls.map((skin) =>
      limit(async () => {
        const downloadedSplash = await downloadChampionAsset(
          skin.url,
          `${champion.id}_${skin.num}`,
          imgDir,
          "jpg"
        );

        if (!downloadedSplash.ok) {
          console.error(
            `Failed to download splash for ${champion.id} - ${skin.name}: ${downloadedSplash.error.message}`
          );
          return;
        }

        console.log(`Downloaded new skin: ${champion.id} - ${skin.name}`);
      })
    );

    await Promise.all(downloadTasks);

    console.log("Converting images to webp format...");

    await convertImagesToWebp("./images/champions/splash", { quality: 90 });

    // Move splash arts to the correct directory for backend usage
    await copyFiles("./images/champions/splash", "./images/splash_arts");
    // Copy images to frontend public directory
    await copyFiles(
      "./images/champions/splash",
      "../frontend/public/splash_arts"
    );

    // Fetch all champions to get the champion ID

    const championId = championRecords.find(
      (c) => c.championKey.toLowerCase() === champion.id.toLowerCase()
    )?.id;

    const skinData = missingSkins.map((skin) => ({
      championId,
      name: skin.name,
      key: skin.num.toString(),
    }));

    // Save new skins to the database

    console.log("Saving new skins to the database...");

    await prisma.skins.createMany({
      data: skinData,
    });

    // Add sleep
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Fetch abilities for champions.
 * Used mostly to seed the db with abilities.
 */
async function saveNewAbilities() {
  const limit = pLimit(2); // limit concurrency to 2 tasks at a time

  const latestPatch = await fetchLatestPatch();
  console.log("Latest patch version:", latestPatch);

  const existingAbilities = await prisma.abilities.findMany({
    select: {
      championId: true,
      key: true,
      champion: {
        select: { championKey: true },
      },
    },
  });

  const existingAbilitiesSet = new Set(
    existingAbilities.map(
      (ability) => `${ability.champion.championKey}-${ability.key}`
    )
  );

  const championsDetails = await getAllChampionDetails();

  const championRecords = await championV2.findAll();

  const imgDir = path.join("./images/champions/abilities");
  await ensureDir(imgDir);

  const championKeys = Object.keys(championsDetails);

  // Download new abilities and convert them to webp
  for (const championKey of championKeys) {
    const championName = championsDetails[championKey].name;
    console.log(
      `Processing abilities for champion: ${championName}. Key: ${championKey}`
    );

    const missingAbilities = Object.values(
      championsDetails[championKey].abilities
    ).filter((ability) => {
      const abilityKey = `${championKey}-${ability.key}`;
      return !existingAbilitiesSet.has(abilityKey);
    });

    if (missingAbilities.length === 0) {
      console.log(
        `No new abilities for champion: ${championName}. Key: ${championKey}`
      );
      continue;
    }

    // Create a list of throttled download tasks
    const downloadTasks = missingAbilities.map((ability) =>
      limit(async () => {
        const downloadedAbility = await downloadChampionAsset(
          ability.icon,
          `${championKey}_${ability.key}`,
          imgDir,
          "png"
        );

        if (!downloadedAbility.ok) {
          console.error(
            `Failed to download ability icon for ${championName} - ${ability.name}: ${downloadedAbility.error.message}`
          );
          return;
        }

        console.log(
          `Downloaded new ability icon: ${championName} - ${ability.name}`
        );
      })
    );

    await Promise.all(downloadTasks);

    console.log("Converting images to webp format...");

    await convertImagesToWebp("./images/champions/abilities", {
      lossless: true,
    });

    // Fetch all champions to get the champion ID

    const championId = championRecords.find(
      (c) => c.championKey.toLowerCase() === championKey.toLowerCase()
    )?.id;

    const abilityData = missingAbilities.map((ability) => ({
      championId,
      name: ability.name,
      key: ability.key,
    }));

    // Save new abilities to the database

    console.log("Saving new abilities to the database...");

    // Move splash arts to the correct directory for backend usage
    await copyFiles("./images/champions/abilities", "./images/abilities");

    // Copy images to frontend public directory
    await copyFiles(
      "./images/champions/abilities",
      "../frontend/public/abilities"
    );

    await prisma.abilities.createMany({
      data: abilityData,
    });

    // Add sleep
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

module.exports = {
  saveNewChampions,
  saveNewSkins,
  saveNewAbilities,
};
