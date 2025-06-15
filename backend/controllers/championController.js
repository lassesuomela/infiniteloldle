const champion = require("../models/championModel");
const user = require("../models/userModel");
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
  const user = await prisma.users.findFirst({ where: { token } });
  if (!user) return res.json({ status: "error", message: "Token is invalid" });

  const correctChampion = await prisma.champions.findFirst({
    where: { id: user.currentChampion },
  });
  if (!correctChampion)
    return res.json({ status: "error", message: "Token is invalid" });

  const guessChampion = await prisma.champions.findFirst({
    where: { name: guess },
  });

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
  const allChampionIds = await prisma.champions.findMany({
    select: { id: true },
  });
  const allIds = allChampionIds.map((c) => c.id);

  // Get solved champion IDs for this user
  const solvedRows = await prisma.userSolvedChampions.findMany({
    where: { userId: user.id },
    select: { championId: true },
  });
  let solvedIds = solvedRows.map((row) => row.championId);

  // Add the just-solved champion if not already present
  if (!solvedIds.includes(correctChampion.id)) {
    await prisma.userSolvedChampions.create({
      data: { userId: user.id, championId: correctChampion.id },
    });
    solvedIds.push(correctChampion.id);
  }

  // Prestige logic
  let prestige = user.prestige;
  let solvedChamps = solvedIds;
  if (solvedIds.length >= allIds.length) {
    // All solved, reset
    await prisma.userSolvedChampions.deleteMany({ where: { userId: user.id } });
    solvedChamps = [];
    prestige += 1;
  }

  // Pick a new champion not yet solved
  const unsolvedIds = allIds.filter((id) => !solvedChamps.includes(id));
  const newChampionId =
    unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];
  // Update user
  await prisma.users.update({
    where: { id: user.id },
    data: {
      currentChampion: newChampionId,
      prestige,
      score: { increment: 1 },
    },
  });

  cache.deleteCache("/user:" + token);

  res.json({
    status: "success",
    correctGuess: true,
    properties: [champData, similarites],
    title: correctChampion.title,
  });
};

const GuessSplash = (req, res) => {
  const { guess } = req.body;

  if (!guess) {
    return res.json({ status: "error", message: "Guess is required" });
  }

  const token = req.token;

  champion.getSplashByToken(token, (err, correctChampionData) => {
    if (!correctChampionData[0]) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // wrong guess return diff

    champion.getByName(guess, (err, guessChampionData) => {
      if (!guessChampionData[0]) {
        return res.json({
          status: "error",
          message: "Nothing found with that champion name",
        });
      }

      if (guess !== correctChampionData[0].name) {
        return res.json({
          status: "success",
          correctGuess: false,
          championKey: guessChampionData[0].championKey,
        });
      } else {
        // correct guess

        champion.getAllIds((err, data) => {
          if (err) {
            console.log(err);
            return res.json({
              status: "error",
              message: "Error on fetching champions ids",
            });
          }

          user.fetchByToken(token, (err, userResult) => {
            if (err) {
              console.log(err);
              return res.json({
                status: "error",
                message: "Error on fetching data with the token provided",
              });
            }

            let solvedChampions;

            if (userResult[0]["solvedSplashChampions"]) {
              solvedChampions =
                correctChampionData[0]["id"] +
                "," +
                userResult[0]["solvedSplashChampions"];
            } else {
              solvedChampions = correctChampionData[0]["id"];
            }

            let solvedChamps;

            // separeate prestige system...
            // fix
            if (
              solvedChampions.length > 1 &&
              solvedChampions.split(",").length > 1 &&
              solvedChampions.split(",").length < data.length
            ) {
              solvedChamps = solvedChampions.split(",");
            } else if (
              solvedChampions.length > 1 &&
              solvedChampions.split(",").length >= data.length
            ) {
              solvedChamps = "";
              solvedChampions = "";

              userResult[0]["prestige"]++;
            } else {
              solvedChamps = solvedChampions.toString();
            }

            // remove solved champs from the all champions pool
            const champPool = data.filter((id) => {
              return !solvedChamps.includes(id["id"].toString());
            });

            const random = Math.floor(Math.random() * champPool.length);

            const newChampion = champPool[random];

            champion.getSplashById(newChampion["id"], (err, result) => {
              const sprites = result[0]["spriteIds"].split(",");

              const random = Math.floor(Math.random() * sprites.length);

              const randomSprite = sprites[random];

              if (randomSprite === undefined) {
                console.log("ERROR, no random sprite");
                console.log(req.body);
                console.log(req.headers);
                console.log(req.token);
                console.log(sprites);
                console.log(sprites.length);
                console.log(random);
              }

              const payload = {
                currentSplashChampion: newChampion["id"],
                solvedSplashChampions: solvedChampions,
                currentSplashId: parseInt(randomSprite),
                prestige: userResult[0]["prestige"],
                score: (userResult[0]["score"] += 1),
                token: token,
              };

              user.updateSplash(payload, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.json({
                    status: "error",
                    message: "Error on updating user data",
                  });
                }

                cache.deleteCache("/user:" + token);

                res.json({
                  status: "success",
                  correctGuess: true,
                  championKey: guessChampionData[0].championKey,
                  title: correctChampionData[0].title,
                });
              });
            });
          });
        });
      }
    });
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
