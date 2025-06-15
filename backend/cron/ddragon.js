const axios = require("axios");
const semver = require("semver");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";

async function saveLatestPatch() {
  try {
    const response = await axios.get(VERSIONS_URL);
    const versions = response.data;

    if (versions.length === 0) throw new Error("No patch versions found.");

    const latestPatch = versions[0];

    const existing = await prisma.lol_patches.findUnique({
      where: { version: latestPatch },
    });

    if (!existing) {
      await prisma.lol_patches.create({
        data: { version: latestPatch },
      });
      console.log("Saved new patch version:", latestPatch);
    } else {
      console.log("Patch version already exists:", latestPatch);
    }
  } catch (err) {
    console.error("Error saving patch version:", err);
  } finally {
    await prisma.$disconnect();
  }
}

saveLatestPatch();
