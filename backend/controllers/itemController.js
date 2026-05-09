const item = require("../models/itemModel");
const cache = require("../middleware/cache");
const redisCache = require("../cache/cache");
const { GuessCountKeys } = require("../helpers/redisKeys");
const itemV2 = require("../models/v2/item");
const userV2 = require("../models/v2/user");
const fs = require("fs").promises;
const path = require("path");
const { applyBlurToImage } = require("../helpers/blur");

const GuessItem = async (req, res) => {
  try {
    const { guess } = req.body;

    if (!guess) {
      return res.json({ status: "error", message: "Guess is required" });
    }

    const token = req.token;
    const user = await userV2.findByToken(token);
    if (!user) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const correctItem = await itemV2.findByItemId(user.currentItemId);
    if (!correctItem) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const guessItemObj = await itemV2.findByName(guess);
    if (!guessItemObj) {
      return res.json({
        status: "error",
        message: "No item with that name",
      });
    }

    // Increment guess count in Redis
    const guessCountKey = GuessCountKeys.item(user.id);
    await redisCache.increment(guessCountKey);

    const guessCount = await redisCache.getGuessCount(guessCountKey);

    if (guess !== correctItem.name) {
      return res.json({
        status: "success",
        correctGuess: false,
        itemId: guessItemObj.itemId,
        name: guessItemObj.name,
        guessCount: guessCount,
      });
    }

    // Correct guess
    // Get guess count from Redis and save to database

    const allIds = await itemV2.findAllItemIds();
    let solvedIds = await userV2.getSolvedItemIds(user.id);

    // Add the just-solved item if not already present
    if (!solvedIds.includes(correctItem.itemId)) {
      await userV2.addSolvedItem(user.id, correctItem.itemId, guessCount);
      solvedIds.push(correctItem.itemId);
    }

    // Delete the guess count from Redis after saving to database
    await redisCache.delete(guessCountKey);

    // Prestige logic
    let prestige = user.prestige;
    let solvedItems = solvedIds;
    if (solvedIds.length >= allIds.length) {
      await userV2.clearSolvedItems(user.id);
      solvedItems = [];
      prestige += 1;
    }

    // Pick a new item not yet solved
    const unsolvedIds = allIds.filter((id) => !solvedItems.includes(id));
    const newItemId =
      unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];
    await userV2.updateById(user.id, {
      currentItemId: newItemId,
      prestige,
      score: { increment: 1 },
    });

    cache.deleteCache("/user:" + token);

    res.json({
      status: "success",
      correctGuess: true,
      name: correctItem.name,
      itemId: correctItem.itemId,
      guessCount: guessCount,
    });
  } catch (error) {
    console.error("Error in GuessItem:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GetItemSprite = async (req, res) => {
  const token = req.token;

  try {
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const currentItemV2 = await itemV2.findByItemId(userObj.currentItemId);
    if (!currentItemV2) {
      return res.json({ status: "error", message: "Item not found for token" });
    }

    const itemId = currentItemV2.itemId;
    const guessCountKey = GuessCountKeys.item(userObj.id);
    const guessCount = await redisCache.getGuessCount(guessCountKey);

    const imageName = `${itemId}.webp`;
    const cacheKey = `item_${imageName}_blur_${guessCount}`;

    if (cache.checkCache(cacheKey)) {
      const data = cache.getCache(cacheKey);
      res.set("X-CACHE", "HIT");
      return res.json({ status: "success", result: data, itemId });
    }

    const imagePath = path.join(__dirname, "../items", imageName);

    let fileBuffer;
    try {
      fileBuffer = await fs.readFile(imagePath);
    } catch (fsErr) {
      console.log(`FATAL: Item image is missing for: ${imageName}`);
      return res.status(404).json({ status: "error", message: "File not found" });
    }

    const blurredBuffer = await applyBlurToImage(fileBuffer, guessCount);
    const base64 = blurredBuffer.toString("base64");

    cache.saveCache(cacheKey, base64);
    cache.changeTTL(cacheKey, 3600 * 6);
    res.set("X-CACHE", "MISS");

    return res.json({ status: "success", result: base64, itemId });
  } catch (error) {
    console.error("Error in GetItemSprite:", error);
    // Legacy fallback: return just the itemId for old clients
    item.getItemByToken(token, (err, result) => {
      if (err || result.length === 0) {
        return res.json({ status: "error", message: "Error on fetching item" });
      }
      res.json({ status: "success", result: null, itemId: result[0]["itemId"] });
    });
  }
};

const GetAllItems = (req, res) => {
  const key = req.path;
  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    return res.json(cache.getCache(key));
  }
  item.getAllNames((err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }

    const items = [];
    result.forEach((item) => {
      items.push({ value: item["name"] });
    });

    const response = { status: "success", items: items };
    cache.saveCache(key, response);
    cache.changeTTL(key, 3600 * 24);
    res.set("X-CACHE", "MISS");

    res.json(response);
  });
};

module.exports = {
  GuessItem,
  GetItemSprite,
  GetAllItems,
};
