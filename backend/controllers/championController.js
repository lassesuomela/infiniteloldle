const champion = require("../models/championModel");
const userV2 = require("../models/v2/user");
const championV2 = require("../models/v2/champion");
const ability = require("../models/v2/ability");
const cache = require("../middleware/cache");
const redisCache = require("../cache/cache");
const { GuessCountKeys } = require("../helpers/redisKeys");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
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

    // Increment guess count in Redis
    const guessCountKey = GuessCountKeys.champion(user.id);
    await redisCache.increment(guessCountKey);

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
      // Get current guess count to return to frontend
      const currentGuessCount = await redisCache.getGuessCount(guessCountKey);

      return res.json({
        status: "success",
        correctGuess: false,
        properties: [champData, similarites],
        guessCount: currentGuessCount,
      });
    }

    // correct guess
    // Get guess count from Redis and save to database
    const guessCount = await redisCache.getGuessCount(guessCountKey);

    // Get all champion IDs
    const allChampionIds = await championV2.findAllIds();

    // Get solved champion IDs for this user
    const solvedRows = await userV2.getSolvedChampionIds(user.id);

    // Add the just-solved champion if not already present
    if (!solvedRows.includes(correctChampion.id)) {
      await userV2.addSolvedChampion(user.id, correctChampion.id, guessCount);
      solvedRows.push(correctChampion.id);
    }

    // Delete the guess count from Redis after saving to database
    await redisCache.delete(guessCountKey);

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
      guessCount: guessCount,
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

    // Increment guess count in Redis
    const guessCountKey = GuessCountKeys.splash(userObj.id);
    await redisCache.increment(guessCountKey);

    if (guess !== correctSkinData.champion.name) {
      return res.json({
        status: "success",
        correctGuess: false,
        championKey: guessChampion.championKey,
        name: guessChampion.name,
      });
    }

    // correct guess
    // Get guess count from Redis and save to database
    const guessCount = await redisCache.getGuessCount(guessCountKey);

    const allIds = await championV2.findAllIds();
    let solvedIds = await userV2.getSolvedSplashChampionIds(userObj.id);

    // Add the just-solved splash if not already present
    if (!solvedIds.includes(correctSkinData.champion.id)) {
      await userV2.addSolvedSplash(
        userObj.id,
        correctSkinData.champion.id,
        guessCount
      );
      solvedIds.push(correctSkinData.champion.id);
    }

    // Delete the guess count from Redis after saving to database
    await redisCache.delete(guessCountKey);

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

    // Increment guess count in Redis
    const guessCountKey = GuessCountKeys.ability(userObj.id);
    await redisCache.increment(guessCountKey);

    if (guess.toLowerCase() !== correctAbility.champion.name.toLowerCase()) {
      return res.json({
        status: "success",
        correctGuess: false,
        name: guessedChampion.name,
        championKey: guessedChampion.championKey,
      });
    }

    // ===== Correct guess =====
    // Get guess count from Redis and save to database
    const guessCount = await redisCache.getGuessCount(guessCountKey);

    // Get all ability IDs
    const allIds = await ability.findAllIds();
    let solvedIds = await userV2.getSolvedAbilityIds(userObj.id);

    // Add the just-solved ability if not already present
    if (!solvedIds.includes(correctAbility.id)) {
      await userV2.addSolvedAbility(userObj.id, correctAbility.id, guessCount);
      solvedIds.push(correctAbility.id);
    }

    // Delete the guess count from Redis after saving to database
    await redisCache.delete(guessCountKey);

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

const GetChampionClue = async (req, res) => {
  const token = req.token;
  try {
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // Get guess count from Redis
    const guessCountKey = GuessCountKeys.champion(userObj.id);
    const guessCount = await redisCache.getGuessCount(guessCountKey);

    if (guessCount < 10) {
      return res.json({
        status: "success",
        clue: null,
        message: "Not enough guesses to unlock clue",
      });
    }

    // Get the current champion for this user
    const currentChampion = await championV2.findById(userObj.currentChampion);
    if (!currentChampion) {
      return res.json({ status: "error", message: "Champion not found" });
    }

    // Get skin data to determine available splash arts
    const skins = await skin.findByChampionId(currentChampion.id);
    if (skins.length === 0) {
      return res.json({
        status: "error",
        message: "No skins found for this champion",
      });
    }

    // Omit default skin (id='0') from clue splashes
    const clueSkins = skins.filter((s) => s.key !== "0");

    // Or if no other skins, use default
    const skinToUse =
      clueSkins.length > 0 ? clueSkins[0] : skins.find((s) => s.key === "0");

    // Use splash art with id 0 (first splash art)
    const splashId = skinToUse.key;
    const imageName = `${currentChampion.championKey}_${splashId}.webp`;
    const imageKey = `clue_skin_${imageName}`;

    // Check if clue image is cached
    if (cache.checkCache(imageKey)) {
      const data = cache.getCache(imageKey);
      res.set("X-CACHE", "HIT");
      res.set(
        "X-CACHE-REMAINING",
        new Date(cache.getTtl(imageKey)).toISOString()
      );
      return res.json({
        status: "success",
        clue: {
          type: "splash_art",
          data: data,
        },
      });
    }

    // Read the original image
    const imagePath = path.join(
      __dirname,
      "../images/champions/splash",
      imageName
    );

    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      const cropWidth = Math.floor(metadata.width * 0.5);
      const cropHeight = Math.floor(metadata.height * 0.5);

      const left = Math.floor((metadata.width - cropWidth) / 2);
      const top = Math.floor((metadata.height - cropHeight) / 2);

      const imageBuffer = await image
        .extract({
          left,
          top,
          width: cropWidth,
          height: cropHeight,
        })
        .toBuffer();

      const base64 = imageBuffer.toString("base64");

      cache.saveCache(imageKey, base64);
      cache.changeTTL(imageKey, 3600 * 12);

      res.set("X-CACHE", "MISS");
      return res.json({
        status: "success",
        clue: {
          type: "splash_art",
          data: base64,
        },
      });
    } catch (error) {
      console.error(`Error processing image ${imageName}:`, error);
      return res.status(404).json({
        status: "error",
        message: "Splash art not found",
      });
    }
  } catch (error) {
    console.error("Error in GetChampionClue function:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GetAbilityClue = async (req, res) => {
  const token = req.token;
  try {
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // Get guess count from Redis
    const guessCountKey = GuessCountKeys.champion(userObj.id);
    const guessCount = await redisCache.getGuessCount(guessCountKey);

    // Ability clue unlocks at 5 guesses (easier than splash)
    if (guessCount < 5) {
      return res.json({
        status: "success",
        clue: null,
        message: "Not enough guesses to unlock clue",
      });
    }

    // Get the current champion for this user
    const currentChampion = await championV2.findById(userObj.currentChampion);
    if (!currentChampion) {
      return res.json({ status: "error", message: "Champion not found" });
    }

    // Get all abilities for this champion
    const abilities = await ability.findByChampionId(currentChampion.id);
    if (abilities.length === 0) {
      return res.json({
        status: "error",
        message: "No abilities found for this champion",
      });
    }

    // Make it somewhat different on what the key will be each day
    // Use week day to pick ability

    // Get current day of week (0-6)
    const dayOfWeek = new Date().getDay();
    // Mon = 1 -> Q, Tue = 2 -> W, Wed = 3 -> E, Thu = 4 -> R, Fri = 5 -> Q, Sat = 6 -> W, Sun = 0 -> E

    // Map day of week to ability key
    const dayToAbilityKey = {
      1: "Q",
      2: "W",
      3: "E",
      4: "R",
      5: "Q",
      6: "W",
      0: "E",
    };
    // Pick E as the ability to use for the clue, or first if no Q
    const abilityToUse = abilities.find(
      (ab) => ab.key === dayToAbilityKey[dayOfWeek]
    )
      ? abilities.find((ab) => ab.key === dayToAbilityKey[dayOfWeek])
      : abilities[0];
    const imageName = `${currentChampion.championKey}_${abilityToUse.key}.webp`;
    const imageKey = `clue_ability_${imageName}`;

    // Check if image is cached
    if (cache.checkCache(imageKey)) {
      const data = cache.getCache(imageKey);
      res.set("X-CACHE", "HIT");
      res.set(
        "X-CACHE-REMAINING",
        new Date(cache.getTtl(imageKey)).toISOString()
      );
      return res.json({
        status: "success",
        clue: {
          type: "ability",
          data: data,
        },
      });
    }

    // Read the original image
    const imagePath = path.join(
      __dirname,
      "../images/champions/abilities",
      imageName
    );

    try {
      const image = sharp(imagePath);
      const imageBuffer = await image.toBuffer();

      const base64 = imageBuffer.toString("base64");

      cache.saveCache(imageKey, base64);
      cache.changeTTL(imageKey, 3600 * 12);

      res.set("X-CACHE", "MISS");
      return res.json({
        status: "success",
        clue: {
          type: "ability",
          data: base64,
        },
      });
    } catch (error) {
      console.error(`Error processing image ${imageName}:`, error);
      return res.status(404).json({
        status: "error",
        message: "Ability image not found",
      });
    }
  } catch (error) {
    console.error("Error in GetAbilityClue function:", error);
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
  GetChampionClue,
  GetAbilityClue,
};
