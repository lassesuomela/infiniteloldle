const axios = require("axios");
const semver = require("semver");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const championV2 = require("../models/v2/champion");

const VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";
const BASE_UNIVERSE_URL =
  "https://universe-meeps.leagueoflegends.com/v1/en_us/champions";

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
    const loreUrl = `${BASE_UNIVERSE_URL}/${championId.toLowerCase()}/index.json`;
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
  const patchResponse = await axios.get(VERSIONS_URL);
  const versions = patchResponse.data;
  if (!versions.length) throw new Error("No patch versions found.");
  return versions[0];
}

async function fetchChampionsForPatch(version) {
  const championsUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
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

async function buildChampionPayload(champion, version) {
  const detailUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champion.id}.json`;
  const detailResponse = await axios.get(detailUrl);

  const skins = detailResponse.data.data[champion.id].skins.map((skin) => ({
    id: skin.id,
    name: skin.name,
    num: skin.num,
  }));

  const genderInfo = await determineGenderFromLore(champion.id);

  // TODO: Fetch release year and region data for each champion from wiki
  return {
    championId: champion.id,
    name: champion.name,
    title: champion.title,
    rangeType: getChampionRangeType(champion.stats.attackrange),
    resource: champion.partype,
    skins,
    gender: genderInfo.gender,
  };
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

    const championPayloads = [];
    for (const champ of missingChampions) {
      const payload = await buildChampionPayload(champ, latestPatch);
      championPayloads.push(payload);
    }

    console.log("Prepared champions:", championPayloads);

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
