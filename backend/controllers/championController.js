const champion = require("../models/championModel");
const user = require("../models/userModel");
const userV2 = require("../models/v2/user");
const championV2 = require("../models/v2/champion");
const cache = require("../middleware/cache");
const fs = require("fs");
const path = require("path");
const GetPartialSimilarites =
  require("../helpers/compare").GetPartialSimilarites;
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const Create = (req, res) => {
  const data = req.body;

  if (
    !data.name ||
    !data.title ||
    !data.resource ||
    !data.skinCount ||
    !data.spriteIds ||
    !data.genre ||
    !data.gender
  ) {
    return res.json({
      status: "error",
      message: "One or more fields must be provided",
    });
  }

  champion.create(data, (err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }

    res.json({ status: "success", message: "Champion added successfully" });
  });
};

const AddMoreData = (req, res) => {
  const body = req.body;

  if (
    !body.champion ||
    !body.data[0].released ||
    !body.data[1].region ||
    !body.data[2].positions ||
    !body.data[3].rangeTypes
  ) {
    return res.json({
      status: "error",
      message: "One or more fields must be provided",
    });
  }

  const data = {
    name: body.champion,
    released: body.data[0].released.toString(),
    region: body.data[1].region.toString(),
    position: body.data[2].positions.toString(),
    rangeType: body.data[3].rangeTypes.toString(),
    damageType: body.data[4].damageType.toString(),
  };

  champion.addMoreData(data, (err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }
    res.json({ status: "success", message: "Champion edited" });
  });
};

const AddChampionId = (req, res) => {
  const body = req.body;

  const data = {
    name: body.name,
    key: body.key,
  };

  if (!body.name || !body.key) {
    return res.json({
      status: "error",
      message: "One or more fields must be provided",
    });
  }

  champion.addChampionId(data, (err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }
    res.json({ status: "success", message: "Champion edited" });
  });
};

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

const GetAllChampionKeys = (req, res) => {
  champion.getAllKeys((err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }

    res.json({ status: "success", championKeys: result });
  });
};

const Guess = async (req, res) => {
  const { guess } = req.body;
  if (!guess)
    return res.json({ status: "error", message: "Guess is required" });

  const token = req.token;
  const user = await userV2.findByToken(token);
  if (!user) return res.json({ status: "error", message: "Token is invalid" });

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
  const unsolvedIds = allChampionIds.filter((id) => !solvedChamps.includes(id));
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
};

const GuessSplash = async (req, res) => {
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
  const correctChampion = await championV2.findById(
    userObj.currentSplashChampion
  );
  if (!correctChampion) {
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

  if (guess !== correctChampion.name) {
    return res.json({
      status: "success",
      correctGuess: false,
      championKey: guessChampion.championKey,
    });
  }

  // correct guess
  const allIds = await championV2.findAllIds();
  let solvedIds = await userV2.getSolvedSplashChampionIds(userObj.id);

  // Add the just-solved splash if not already present
  if (!solvedIds.includes(correctChampion.id)) {
    await userV2.addSolvedSplash(userObj.id, correctChampion.id);
    solvedIds.push(correctChampion.id);
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
  const newChampion = await championV2.findById(newChampionId);

  // Pick a random splash sprite
  const sprites = newChampion.spriteIds.split(",");
  const randomSprite = sprites[Math.floor(Math.random() * sprites.length)];

  // Update user splash info
  await userV2.updateById(userObj.id, {
    currentSplashChampion: newChampionId,
    currentSplashId: parseInt(randomSprite),
    prestige,
    score: { increment: 1 },
  });

  cache.deleteCache("/user:" + token);

  res.json({
    status: "success",
    correctGuess: true,
    championKey: guessChampion.championKey,
    title: correctChampion.title,
  });
};

const GetSplashArt = (req, res) => {
  const token = req.token;

  user.fetchSplashArtByToken(token, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "Error on fetching splash art",
      });
    }

    if (!result) {
      return res.json({
        status: "error",
        message: "Splash art was not found for that token",
      });
    }

    const imageName =
      result[0].championKey + "_" + result[0].currentSplashId + ".webp";

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

    const imagePath = path.join(__dirname, "../splash_arts", imageName);

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.log(`FATAL: Image is missing for: ${imageName}`);
        return res.status(404).json({
          status: "error",
          message: "File not found",
        });
      }
      const base64 = data.toString("base64");
      cache.saveCache(imageName, base64);
      cache.changeTTL(imageName, 3600 * 6);

      return res.json({
        status: "success",
        result: base64,
      });
    });
  });
};

module.exports = {
  Create,
  AddMoreData,
  AddChampionId,
  GetAllChampions,
  Guess,
  GuessSplash,
  GetSplashArt,
  GetAllChampionKeys,
};
