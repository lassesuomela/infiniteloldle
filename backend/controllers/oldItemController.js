const oldItemModel = require("../models/oldItemModel");
const user = require("../models/userModel");
const cache = require("../middleware/cache");
const redisCache = require("../cache/cache");
const fs = require("fs");
const path = require("path");
const oldItemV2 = require("../models/v2/oldItem");
const userV2 = require("../models/v2/user");

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

    const correctOldItem = await oldItemV2.findById(user.currentOldItemId);
    if (!correctOldItem) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const guessOldItem = await oldItemV2.findByName(guess);
    if (!guessOldItem) {
      return res.json({
        status: "error",
        message: "Nothing found with that item name",
      });
    }

    // Increment guess count in Redis
    const guessCountKey = `userId:${user.id}:oldItem:guessCount`;
    await redisCache.increment(guessCountKey);

    if (guess !== correctOldItem.name) {
      return res.json({
        status: "success",
        correctGuess: false,
        itemId: guessOldItem.old_item_key,
        name: guessOldItem.name,
      });
    }

    // Correct guess
    // Get guess count from Redis and save to database
    const guessCount = await redisCache.getGuessCount(guessCountKey);
    
    const allIds = await oldItemV2.findAllIds();
    let solvedIds = await userV2.getSolvedOldItemIds(user.id);

    // Add the just-solved old item if not already present
    if (!solvedIds.includes(correctOldItem.id)) {
      await userV2.addSolvedOldItem(user.id, correctOldItem.id, guessCount);
      solvedIds.push(correctOldItem.id);
    }

    // Delete the guess count from Redis after saving to database
    await redisCache.delete(guessCountKey);

    // Prestige logic
    let prestige = user.prestige;
    let solvedItems = solvedIds;
    if (solvedIds.length >= allIds.length) {
      await userV2.clearSolvedOldItems(user.id);
      solvedItems = [];
      prestige += 1;
    }

    // Filter out solved items
    const unsolvedIds = allIds.filter((id) => !solvedItems.includes(id));
    const newOldItemId =
      unsolvedIds[Math.floor(Math.random() * unsolvedIds.length)];
    await userV2.updateById(user.id, {
      currentOldItemId: newOldItemId,
      prestige,
      score: { increment: 1 },
    });

    cache.deleteCache("/user:" + token);

    res.json({
      status: "success",
      correctGuess: true,
      itemId: guessOldItem.old_item_key,
      name: correctOldItem.name,
    });
  } catch (error) {
    console.error("Error in GuessItem:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

const GetItemSprite = (req, res) => {
  const token = req.token;

  oldItemModel.getItemByToken(token, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error", message: "Error on fetching item" });
    }

    if (result.length === 0) {
      return res.json({
        status: "error",
        message: "Item was not found for that token",
      });
    }

    const imageName = result[0]["old_item_key"] + ".webp";

    if (cache.checkCache(imageName)) {
      const data = cache.getCache(imageName);
      res.set("X-CACHE", "HIT");
      return res.json({
        status: "success",
        result: data,
      });
    }

    const imagePath = path.join(__dirname, "../old_items", imageName);

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
      res.set("X-CACHE", "MISS");

      return res.json({
        status: "success",
        result: base64,
      });
    });
  });
};

const GetAllItems = (req, res) => {
  const key = req.path;
  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    res.set("X-CACHE-REMAINING", new Date(cache.getTtl(key)).toISOString());
    return res.json(cache.getCache(key));
  }
  oldItemModel.getAllNames((err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }

    const items = [];
    result.forEach((item) => {
      items.push({ value: item["name"] });
    });

    const response = { status: "success", items: items };
    cache.saveCache(key, response);
    cache.changeTTL(key, 3600 * 6);

    res.json(response);
  });
};

module.exports = {
  GuessItem,
  GetItemSprite,
  GetAllItems,
};
