const item = require("../models/itemModel");
const cache = require("../middleware/cache");
const itemV2 = require("../models/v2/item");
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

    if (guess !== correctItem.name) {
      return res.json({
        status: "success",
        correctGuess: false,
        itemId: guessItemObj.itemId,
        name: guessItemObj.name,
      });
    }

    // Correct guess
    const allIds = await itemV2.findAllItemIds();
    let solvedIds = await userV2.getSolvedItemIds(user.id);

    // Add the just-solved item if not already present
    if (!solvedIds.includes(correctItem.itemId)) {
      await userV2.addSolvedItem(user.id, correctItem.itemId);
      solvedIds.push(correctItem.itemId);
    }

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

  item.getItemByToken(token, (err, result) => {
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

    res.json({ status: "success", result: result[0]["itemId"] });
  });
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
