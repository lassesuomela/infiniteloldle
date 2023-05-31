const oldItemModel = require("../models/oldItemModel");
const user = require("../models/userModel");
const cache = require("../middleware/cache");

const Create = (req, res) => {
  const data = req.body;

  if (!data.name || !data.key) {
    return res.status(500).json({
      status: "error",
      message: "One or more fields must be provided",
    });
  }

  console.log(data);

  oldItemModel.create(data, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "error", error: err });
    }

    res.json({ status: "success", message: "Item added successfully" });
  });
};

const GuessItem = (req, res) => {
  const { guess } = req.body;

  if (!guess) {
    return res.json({ status: "error", message: "Guess is required" });
  }

  const token = req.token;

  oldItemModel.getItemByToken(token, (err, data) => {
    if (!data[0]) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // wrong guess
    if (guess !== data[0].name) {
      oldItemModel.getIdByName(guess, (err, guessItemData) => {
        if (!data[0]) {
          return res.json({
            status: "error",
            message: "No item with that name",
          });
        }
        return res.json({
          status: "success",
          correctGuess: false,
          itemId: guessItemData[0].old_item_key,
        });
      });
    } else {
      // correct guess

      oldItemModel.getAllIds((err, itemData) => {
        if (err) {
          console.log(err);
          return res.json({
            status: "error",
            message: "Error on fetching item ids",
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

          let solvedItemIds;

          if (userResult[0]["solvedOldItemIds"]) {
            solvedItemIds =
              userResult[0]["currentOldItemId"] +
              "," +
              userResult[0]["solvedOldItemIds"];
          } else {
            solvedItemIds = userResult[0]["currentOldItemId"];
          }

          let solvedItemsArray;
          if (solvedItemIds && solvedItemIds.length > 1) {
            solvedItemsArray = solvedItemIds.split(",");
          } else if (!solvedItemIds) {
            solvedItemsArray = "";
          } else {
            solvedItemsArray = solvedItemIds.toString();
          }

          // TODO: add prestige stuff

          // remove solved items from the all items pool
          const itemPool = itemData.filter((item) => {
            return !solvedItemsArray.includes(item["id"].toString());
          });

          const random = Math.floor(Math.random() * itemPool.length);

          const newItem = itemPool[random];

          const payload = {
            currentOldItemId: newItem["id"],
            solvedOldItemIds: solvedItemsArray.toString(),
            score: (userResult[0]["score"] += 1),
            prestige: userResult[0]["prestige"],
            token: token,
          };

          user.updateOldItem(payload, (err, result) => {
            if (err) {
              console.log(err);
              return res.json({
                status: "error",
                message: "Error on updating user data",
              });
            }

            res.json({
              status: "success",
              correctGuess: true,
              name: data[0].name,
              itemId: data[0].old_item_key,
            });
          });
        });
      });
    }
  });
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

    res.json({ status: "success", result: result[0]["old_item_key"] });
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
      items.push({ label: item["name"], value: item["name"] });
    });

    const response = { status: "success", items: items };
    cache.saveCache(key, response);
    cache.changeTTL(key, 3600);

    res.json(response);
  });
};

module.exports = {
  Create,
  GuessItem,
  GetItemSprite,
  GetAllItems,
};
