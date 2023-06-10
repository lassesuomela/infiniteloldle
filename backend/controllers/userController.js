const user = require("../models/userModel");
const champion = require("../models/championModel");
const item = require("../models/itemModel");
const oldItem = require("../models/oldItemModel");
const crypto = require("crypto");
const geoip = require("geoip-lite");
const cache = require("../middleware/cache");
const oldItemModel = require("../models/oldItemModel");

const Create = (req, res) => {
  crypto.randomBytes(46, (err, token) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error", message: "Error on token creation" });
    }

    token = token.toString("base64");

    let { nickname } = req.body;

    if (nickname && nickname.length > 30) {
      nickname = nickname.substring(0, 30);
    }

    const ip = req.ip;

    const ipData = ip ? geoip.lookup(ip) : "";

    const country = !ipData ? null : ipData.country;

    champion.getAllIds((err, data) => {
      if (err) {
        console.log(err);
        return res.json({
          status: "error",
          message: "Error on fetching champion ids",
        });
      }

      const random = Math.floor(Math.random() * data.length);

      const currentChampion = data[random];

      const randomSplash = Math.floor(Math.random() * data.length);

      const currentSplashChampion = data[randomSplash];

      item.getAllIds((err, itemData) => {
        if (err) {
          console.log(err);
          return res.json({
            status: "error",
            message: "Error on fetching item ids",
          });
        }

        const randomItemIdx = Math.floor(Math.random() * itemData.length);

        const currentItemId = itemData[randomItemIdx];

        if (!nickname) {
          nickname = "Teemo#" + Math.floor(Math.random() * 9999);
        }

        champion.getSplashById(currentSplashChampion["id"], (err, result) => {
          if (err) {
            console.log(err);
            return res.json({
              status: "error",
              message: "Error on fetching splash art ids",
            });
          }

          const sprites = result[0]["spriteIds"].split(",");

          const randomSpriteId = Math.floor(Math.random() * sprites.length);

          const randomSprite = sprites[randomSpriteId];

          oldItem.getAllIds((err, oldItemData) => {
            if (err) {
              console.log(err);
              return res.json({
                status: "error",
                message: "Error on fetching old item ids",
              });
            }

            const randomOldItemIdx = Math.floor(
              Math.random() * oldItemData.length
            );

            const currentOldItemId = oldItemData[randomOldItemIdx];

            const userData = {
              nickname: nickname,
              token: token,
              currentChampion: currentChampion["id"],
              currentSplashChampion: currentSplashChampion["id"],
              currentSplashId: parseInt(randomSprite),
              timestamp: new Date().toLocaleDateString("en"),
              country: country,
              currentItemId: currentItemId["itemId"],
              currentOldItemId: currentOldItemId["id"],
            };

            user.create(userData, (err, result) => {
              if (err) {
                console.log(err);
                return res.json({
                  status: "error",
                  message: "Error on fetching ids",
                });
              }

              res.json({ status: "success", token: token });
            });
          });
        });
      });
    });
  });
};

const CheckToken = (req, res) => {
  const token = req.token;

  const key = req.path + ":" + token;

  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    res.set("X-CACHE-REMAINING", new Date(cache.getTtl(key)).toISOString());
    return res.json(cache.getCache(key));
  }

  user.fetchByToken(token, (err, result) => {
    if (result && result[0]) {
      delete result[0]["solvedChampions"];
      delete result[0]["currentSplashChampion"];
      delete result[0]["solvedSplashChampions"];
      delete result[0]["solvedItemIds"];
      delete result[0]["currentItemId"];

      const response = {
        status: "success",
        message: "Token is valid",
        player: result[0],
      };

      cache.saveCache(key, response);
      res.json(response);
    } else {
      res.json({ status: "error", message: "Token is not valid" });
    }
  });
};

const ChangeCountry = (req, res) => {
  const token = req.token;

  const ip = req.ip;

  const ipData = ip ? geoip.lookup(ip) : "";

  const country = !ipData ? "n/a" : ipData.country;

  const data = {
    country: country,
    token: token,
  };

  user.setCountry(data, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error", message: "Error on setting country" });
    }

    if (result.affectedRows !== 0) {
      return res.json({ status: "success", message: "Country updated" });
    } else {
      return res.json({
        status: "error",
        message: "No user was found with that token",
      });
    }
  });
};

const ChangeNickname = (req, res) => {
  let { nickname } = req.body;

  if (!nickname) {
    return res.json({ status: "error", message: "Nickname is required" });
  }

  if (nickname.length > 30) {
    nickname = nickname.substring(0, 30);
  }

  const data = {
    nickname: nickname,
    token: req.token,
  };

  user.changeNickname(data, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "Error on changing nickname",
      });
    }

    if (result.affectedRows !== 0) {
      return res.json({ status: "success", message: "Nickname updated" });
    } else {
      return res.json({
        status: "error",
        message: "No user was found with that token",
      });
    }
  });
};

const DeleteUser = (req, res) => {
  user.deleteUser(req.token, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "Error on deleting account",
      });
    }

    if (result.affectedRows !== 0) {
      return res.json({ status: "success", message: "Account deleted" });
    } else {
      return res.json({
        status: "error",
        message: "No user was found with that token",
      });
    }
  });
};

const ChangeChampionGuess = (req, res) => {
  const token = req.token;
  champion.getAllIds((err, data) => {
    if (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "Error on fetching champions ids",
      });
    }

    user.fetchByToken(token, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          status: "error",
          message: "Error on fetching data with the token provided",
        });
      }

      let solvedChampions = result[0]["solvedChampions"];
      let solvedChamps, champPool;

      if (solvedChampions) {
        if (
          solvedChampions.length > 1 &&
          solvedChampions.split(",").length > 1 &&
          solvedChampions.split(",").length < data.length
        ) {
          solvedChamps = solvedChampions.split(",");
        } else {
          solvedChamps = solvedChampions.toString();
        }

        // remove solved champs from the all champions pool
        champPool = data.filter((id) => {
          return !solvedChamps.includes(id["id"].toString());
        });
      } else {
        champPool = data.map((id) => {
          return id;
        });
      }

      const random = Math.floor(Math.random() * champPool.length);

      const newChampion = champPool[random];

      let payload = {
        currentChampion: newChampion["id"],
        solvedChampions: solvedChampions,
        prestige: result[0]["prestige"],
        score: result[0]["score"],
        token: token,
      };

      user.update(payload, (err, result) => {
        if (err) {
          console.log(err);
          return res.json({
            status: "error",
            message: "Error on updating user data",
          });
        }

        res.json({
          status: "success",
          message: "Changed guess to champion game",
        });
      });
    });
  });
};

const ChangeSplashGuess = (req, res) => {
  const token = req.token;
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

      let solvedChampions = userResult[0]["solvedSplashChampions"];
      let solvedChamps, champPool;
      if (solvedChampions) {
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
        champPool = data.filter((id) => {
          return !solvedChamps.includes(id["id"].toString());
        });
      } else {
        champPool = data.filter((id) => {
          return id;
        });
      }

      const random = Math.floor(Math.random() * champPool.length);

      const newChampion = champPool[random];

      champion.getSplashById(newChampion["id"], (err, result) => {
        const sprites = result[0]["spriteIds"].split(",");

        const random = Math.floor(Math.random() * sprites.length);

        const randomSprite = sprites[random];

        let payload = {
          currentSplashChampion: newChampion["id"],
          solvedSplashChampions: solvedChampions,
          currentSplashId: parseInt(randomSprite),
          prestige: userResult[0]["prestige"],
          score: userResult[0]["score"],
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

          res.json({
            status: "success",
            message: "Changed splash guess",
          });
        });
      });
    });
  });
};
const ChangeItemGuess = (req, res) => {
  const token = req.token;
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

      let solvedItemIds = userResult[0]["solvedItemIds"];

      let solvedItemsArray, itemPool;
      if (solvedItemIds) {
        if (solvedItemIds && solvedItemIds.length > 1) {
          solvedItemsArray = solvedItemIds.split(",");
        } else {
          solvedItemsArray = solvedItemIds.toString();
        }
        itemPool = itemData.filter((item) => {
          return !solvedItemsArray.includes(item["itemId"].toString());
        });
      } else {
        itemPool = itemData.map((item) => {
          return item;
        });
      }
      // TODO: add prestige stuff

      const random = Math.floor(Math.random() * itemPool.length);

      const newItem = itemPool[random];

      const payload = {
        currentItemId: newItem["itemId"],
        solvedItemIds: solvedItemsArray ? solvedItemsArray.toString() : null,
        score: userResult[0]["score"],
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
          message: "Changed item guess",
        });
      });
    });
  });
};
const ChangeoldItemGuess = (req, res) => {
  const token = req.token;

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

      let solvedItemIds = userResult[0]["solvedOldItemIds"];
      let solvedItemsArray, itemPool;

      if (solvedItemIds) {
        if (solvedItemIds && solvedItemIds.length > 1) {
          solvedItemsArray = solvedItemIds.split(",");
        } else if (!solvedItemIds) {
          solvedItemsArray = "";
        } else {
          solvedItemsArray = solvedItemIds.toString();
        }
        itemPool = itemData.filter((item) => {
          return !solvedItemsArray.includes(item["id"].toString());
        });
      } else {
        itemPool = itemData.map((item) => {
          return item;
        });
      }

      const random = Math.floor(Math.random() * itemPool.length);

      const newItem = itemPool[random];

      const payload = {
        currentOldItemId: newItem["id"],
        solvedOldItemIds: solvedItemsArray ? solvedItemsArray.toString() : null,
        score: userResult[0]["score"],
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
          message: "Changed old item guess",
        });
      });
    });
  });
};
module.exports = {
  Create,
  CheckToken,
  ChangeNickname,
  DeleteUser,
  ChangeCountry,
  ChangeChampionGuess,
  ChangeSplashGuess,
  ChangeItemGuess,
  ChangeoldItemGuess,
};
