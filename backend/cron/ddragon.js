// getLatestPatch.js

const axios = require("axios");

const VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";

async function fetchLatestPatch() {
  try {
    const response = await axios.get(VERSIONS_URL);
    const versions = response.data;

    if (Array.isArray(versions) && versions.length > 0) {
      const latestPatch = versions[0];
      console.log("Latest League of Legends Patch Version:", latestPatch);
    } else {
      console.error("Unexpected response format:", versions);
    }
  } catch (error) {
    console.error("Failed to fetch patch versions:", error.message);
  }
}

fetchLatestPatch();
