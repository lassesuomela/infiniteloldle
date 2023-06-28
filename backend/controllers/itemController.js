const item = require("../models/itemModel");
const user = require("../models/userModel");
const cache = require("../middleware/cache");

const Create = (req, res) => {
  const data = req.body;

  if (!data.name || !data.id) {
    return res.json({
      status: "error",
      message: "One or more fields must be provided",
    });
  }

  item.create(data, (err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
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

  item.getItemByToken(token, (err, data) => {
    if (!data[0]) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    // wrong guess
    if (guess !== data[0].name) {
      item.getIdByName(guess, (err, guessItemData) => {
        if (!guessItemData[0]) {
          return res.json({
            status: "error",
            message: "No item with that name",
          });
        }
        return res.json({
          status: "success",
          correctGuess: false,
          itemId: guessItemData[0].itemId,
        });
      });
    } else {
      // correct guess

      item.getAllIds((err, itemData) => {
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

          if (userResult[0]["solvedItemIds"]) {
            solvedItemIds =
              userResult[0]["currentItemId"] +
              "," +
              userResult[0]["solvedItemIds"];
          } else {
            solvedItemIds = userResult[0]["currentItemId"];
          }

          let solvedItemsArray;
          if (solvedItemIds.length > 1) {
            solvedItemsArray = solvedItemIds.split(",");
          } else {
            solvedItemsArray = solvedItemIds.toString();
          }

          // TODO: add prestige stuff

          // remove solved items from the all items pool
          const itemPool = itemData.filter((item) => {
            return !solvedItemsArray.includes(item["itemId"].toString());
          });

          const random = Math.floor(Math.random() * itemPool.length);

          const newItem = itemPool[random];

          if (newItem === undefined || newItem["itemId"]) {
            console.log("ERROR, no newItem");
            console.log(req.body);
            console.log(req.headers);
            console.log(req.token);
            console.log(itemPool);
            console.log(itemPool.length);
            console.log(random);
            console.log(newItem);
          }

          const payload = {
            currentItemId: newItem["itemId"],
            solvedItemIds: solvedItemsArray.toString(),
            score: (userResult[0]["score"] += 1),
            prestige: userResult[0]["prestige"],
            token: token,
          };

          user.updateItem(payload, (err, result) => {
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
              itemId: data[0].itemId,
            });
          });
        });
      });
    }
  });
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

const GetAllItems = async (req, res) => {
  const key = req.path;
  if (await cache.checkCache(key)) {
    return res.json(await cache.getCache(key));
  }
  item.getAllNames(async (err, result) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }

    const items = [];
    result.forEach((item) => {
      items.push({ label: item["name"], value: item["name"] });
    });

    const response = { status: "success", items: items };
    await cache.saveCache(key, response);
    await cache.changeTTL(key, 3600 * 6);

    res.json(response);
  });
};

module.exports = {
  Create,
  GuessItem,
  GetItemSprite,
  GetAllItems,
};
