const champion = require("../models/championModel");
const userV2 = require("../models/v2/user");
const championV2 = require("../models/v2/champion");
const ability = require("../models/v2/ability");
const cache = require("../middleware/cache");
const fs = require("fs");
const path = require("path");
const GetPartialSimilarites =
  require("../helpers/compare").GetPartialSimilarites;
const { PrismaClient } = require("../generated/prisma");
const skin = require("../models/v2/skin");
const fsp = require("fs").promises;

const prisma = new PrismaClient();

const GetAllChampions = (req, res) => {
  const key = req.path;
  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    return res.json(cache.getCache(key));
  }
  champion.getAllNamesAndKeys((err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }

    const champions = [];
    result.forEach((champ) => {
      champions.push({
        value: champ["name"],
        image: champ["championKey"],
      });
    });

    const response = { status: "success", champions: champions };
    cache.saveCache(key, response);
    cache.changeTTL(key, 3600 * 24);
    res.set("X-CACHE", "MISS");
    res.json(response);
  });
};

const Guess = async (req, res) => {
  try {
    const { guess } = req.body;
    if (!guess)
      return res.json({ status: "error", message: "Guess is required" });

    const token = req.token;
    const user = await userV2.findByToken(token);
    if (!user)
      return res.json({ status: "error", message: "Token is invalid" });

    const correctChampion = await championV2.findById(user.currentChampion);
    if (!correctChampion)
      return res.json({ status: "error", message: "Token is invalid" });

    const guessChampion = await championV2.findByName(guess);

    if (!guessChampion) {
      return res.json({
        status: "error",
        message: "Nothing found with that champion name",
      });
    }

    const champData = {
      guessedChampion: guessChampion.name,
      championKey: guessChampion.championKey,
      resource: guessChampion.resource,
      gender: guessChampion.gender,
      position: guessChampion.position,
      rangeType: guessChampion.rangeType,
      region: guessChampion.region,
      releaseYear: guessChampion.released,
      genre: guessChampion.genre,
      damageType: guessChampion.damageType,
    };

    const similarites = {
      sameResource: guessChampion.resource === correctChampion.resource,
      sameGender: guessChampion.gender === correctChampion.gender,
      sameReleaseYear:
        correctChampion.released === guessChampion.released
          ? "="
          : correctChampion.released > guessChampion.released
          ? ">"
          : "<",
      samePosition: GetPartialSimilarites(
        guessChampion.position,
        correctChampion.position
      ),
      sameRangeType: GetPartialSimilarites(
        guessChampion.rangeType,
        correctChampion.rangeType
      ),
      sameRegion: GetPartialSimilarites(
        guessChampion.region,
        correctChampion.region
      ),
      sameGenre: GetPartialSimilarites(
        guessChampion.genre,
        correctChampion.genre
      ),
      sameDamageType: GetPartialSimilarites(
        guessChampion.damageType,
        correctChampion.damageType
      ),
    };
    if (guess !== correctChampion.name) {
      return res.json({
        status: "success",
        correctGuess: false,
        properties: [champData, similarites],
      });
    }

    // correct guess
    // Get all champion IDs
    const allChampionIds = await championV2.findAllIds();

    // Get solved champion IDs for this user
    const solvedRows = await userV2.getSolvedChampionIds(user.id);

    // Add the just-solved champion if not already present
    if (!solvedRows.includes(correctChampion.id)) {
      await userV2.addSolvedChampion(user.id, correctChampion.id);
      solvedRows.push(correctChampion.id);
    }

    // Prestige logic
    let prestige = user.prestige;
    let solvedChamps = solvedRows;
    if (solvedRows.length >= allChampionIds.length) {
      // All solved, reset
      await userV2.clearSolvedChampions(user.id);
      solvedChamps = [];
      prestige += 1;
    }

    // Pick a new champion not yet solved
    const unsolvedIds = allChampionIds.filter(
      (id) => !solvedChamps.includes(id)
    );
    const newChampionId =
      unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];
    // Update user
    await userV2.updateById(user.id, {
      currentChampion: newChampionId,
      prestige,
      score: { increment: 1 },
    });

    cache.deleteCache("/user:" + token);

    res.json({
      status: "success",
      correctGuess: true,
      properties: [champData, similarites],
      title: correctChampion.title,
    });
  } catch (error) {
    console.error("Error in Guess function:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GuessSplash = async (req, res) => {
  try {
    const { guess } = req.body;
    if (!guess) {
      return res.json({ status: "error", message: "Guess is required" });
    }

    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // Get the correct champion for the user's current splash
    const correctSkinData = await skin.findById(userObj.currentSplashSkinId);
    if (!correctSkinData) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // Get the guessed champion
    const guessChampion = await championV2.findByName(guess);
    if (!guessChampion) {
      return res.json({
        status: "error",
        message: "Nothing found with that champion name",
      });
    }

    if (guess !== correctSkinData.champion.name) {
      return res.json({
        status: "success",
        correctGuess: false,
        championKey: guessChampion.championKey,
        name: guessChampion.name,
      });
    }

    // correct guess
    const allIds = await championV2.findAllIds();
    let solvedIds = await userV2.getSolvedSplashChampionIds(userObj.id);

    // Add the just-solved splash if not already present
    if (!solvedIds.includes(correctSkinData.champion.id)) {
      await userV2.addSolvedSplash(userObj.id, correctSkinData.champion.id);
      solvedIds.push(correctSkinData.champion.id);
    }

    // Prestige logic
    let prestige = userObj.prestige;
    let solvedChamps = solvedIds;
    if (solvedIds.length >= allIds.length) {
      await userV2.clearSolvedSplashes(userObj.id);
      solvedChamps = [];
      prestige += 1;
    }

    // Pick a new champion not yet solved
    const unsolvedIds = allIds.filter((id) => !solvedChamps.includes(id));
    const newChampionId =
      unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];

    // Pick a random splash sprite

    const skins = await skin.findByChampionId(newChampionId);

    if (skins.length === 0) {
      console.log("FATAL: No skins found for champion ID", newChampionId);
      return res.json({
        status: "error",
        message: "No skins found for this champion",
      });
    }

    const randomSkinIndex = Math.floor(Math.random() * skins.length);
    const randomSkin = skins[randomSkinIndex];

    // Update user splash info
    await userV2.updateById(userObj.id, {
      currentSplashSkinId: randomSkin.id,
      prestige,
      score: { increment: 1 },
    });

    cache.deleteCache("/user:" + token);

    res.json({
      status: "success",
      correctGuess: true,
      championKey: guessChampion.championKey,
      title: correctSkinData.champion.title,
    });
  } catch (error) {
    console.error("Error in Splash Guess function:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GetSplashArt = async (req, res) => {
  const token = req.token;
  try {
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    if (!userObj.currentSplashSkinId) {
      return res.json({
        status: "error",
        message: "No current splash art set for this user",
      });
    }

    // Fetch the splash art from the database
    const currentSplashSkinId = userObj.currentSplashSkinId;

    const skinData = await skin.findById(currentSplashSkinId);
    if (!skinData) {
      return res.json({
        status: "error",
        message: "Splash art not found for this user",
      });
    }

    const imageName = `${skinData.champion.championKey}_${skinData.key}.webp`;

    if (cache.checkCache(imageName)) {
      const data = cache.getCache(imageName);
      res.set("X-CACHE", "HIT");
      res.set(
        "X-CACHE-REMAINING",
        new Date(cache.getTtl(imageName)).toISOString()
      );
      return res.json({
        status: "success",
        result: data,
      });
    }

    const imagePath = path.join(
      __dirname,
      "../images/champions/splash",
      imageName
    );

    const file = await fsp.readFile(imagePath);
    if (!file) {
      console.log(`FATAL: Image is missing for: ${imageName}`);
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    const base64 = file.toString("base64");
    cache.saveCache(imageName, base64);
    cache.changeTTL(imageName, 3600 * 6);

    return res.json({
      status: "success",
      result: base64,
    });
  } catch (error) {
    console.error("Error in GetSplashArt function:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GuessAbility = async (req, res) => {
  try {
    const { guess } = req.body;
    if (!guess) {
      return res.json({ status: "error", message: "Guess is required" });
    }

    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // Get the correct ability
    const correctAbility = await ability.findById(userObj.currentAbilityId, {
      include: { champion: true },
    });
    if (!correctAbility) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const guessedChampion = await championV2.findByName(guess);

    if (!guessedChampion) {
      return res.json({
        status: "error",
        message: "Nothing found with that champion name",
      });
    }

    if (guess.toLowerCase() !== correctAbility.champion.name.toLowerCase()) {
      return res.json({
        status: "success",
        correctGuess: false,
        name: guessedChampion.name,
        championKey: guessedChampion.championKey,
      });
    }

    // ===== Correct guess =====
    // Get all ability IDs
    const allIds = await ability.findAllIds();
    let solvedIds = await userV2.getSolvedAbilityIds(userObj.id);

    // Add the just-solved ability if not already present
    if (!solvedIds.includes(correctAbility.id)) {
      await userV2.addSolvedAbility(userObj.id, correctAbility.id);
      solvedIds.push(correctAbility.id);
    }

    // Prestige logic
    let prestige = userObj.prestige;
    let solved = solvedIds;
    if (solved.length >= allIds.length) {
      await userV2.clearSolvedAbilities(userObj.id);
      solved = [];
      prestige += 1;
    }

    // Pick a new ability not yet solved
    const unsolvedIds = allIds.filter((id) => !solved.includes(id));
    const newAbilityId =
      unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];

    // Update user
    await userV2.updateById(userObj.id, {
      currentAbilityId: newAbilityId,
      prestige,
      score: { increment: 1 },
    });

    cache.deleteCache("/user:" + token);

    res.json({
      status: "success",
      correctGuess: true,
      abilityName: correctAbility.name,
      name: correctAbility.champion.name,
      championKey: correctAbility.champion.championKey,
    });
  } catch (error) {
    console.error("Error in GuessAbility function:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GetAbilitySprite = async (req, res) => {
  const token = req.token;
  try {
    let userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    if (!userObj.currentAbilityId) {
      // No current ability set for this user
      // Set ability to a random one if not set
      const abilityIds = await ability.findAllIds();
      const randomAbilityId =
        abilityIds[Math.floor(Math.random() * abilityIds.length)];

      userObj = await userV2.updateById(userObj.id, {
        currentAbilityId: randomAbilityId,
      });
    }

    const abilityData = await ability.findById(userObj.currentAbilityId, {
      include: { champion: true },
    });
    if (!abilityData) {
      return res.json({
        status: "error",
        message: "Ability not found for this user",
      });
    }

    // Compose image filename, e.g. championKey_abilityKey.webp
    const imageName = `${abilityData.champion.championKey}_${abilityData.key}.webp`;

    if (cache.checkCache(imageName)) {
      const data = cache.getCache(imageName);
      res.set("X-CACHE", "HIT");
      res.set(
        "X-CACHE-REMAINING",
        new Date(cache.getTtl(imageName)).toISOString()
      );
      return res.json({
        status: "success",
        result: data,
      });
    }

    const imagePath = path.join(
      __dirname,
      "../images/champions/abilities",
      imageName
    );

    const file = await fsp.readFile(imagePath);
    if (!file) {
      console.log(`FATAL: Ability sprite missing for: ${imageName}`);
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    const base64 = file.toString("base64");
    cache.saveCache(imageName, base64);
    cache.changeTTL(imageName, 3600 * 6);

    return res.json({
      status: "success",
      result: base64,
    });
  } catch (error) {
    console.error("Error in GetAbilitySprite function:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

module.exports = {
  GetAllChampions,
  Guess,
  GuessSplash,
  GetSplashArt,
  GuessAbility,
  GetAbilitySprite,
};
