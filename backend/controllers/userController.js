const user = require("../models/userModel");
const champion = require("../models/championModel");
const item = require("../models/itemModel");
const oldItem = require("../models/oldItemModel");
const crypto = require("crypto");
const cache = require("../middleware/cache");
const redisCache = require("../cache/cache");
const userV2 = require("../models/v2/user");
const championV2 = require("../models/v2/champion");
const itemV2 = require("../models/v2/item");
const oldItemV2 = require("../models/v2/oldItem");
const skin = require("../models/v2/skin");
const ability = require("../models/v2/ability");

const GetNickname = (nick) => {
  let nickname = nick ? nick.trim() : "";
  if (nick?.length > 30) {
    nickname = nick.substring(0, 30);
  }

  if (!nick) {
    const randomStr = Math.random().toString(36).slice(-5).toUpperCase();
    nickname = `Teemo#${randomStr}`;
  }

  return nickname;
};

const Create = (req, res) => {
  crypto.randomBytes(46, (err, token) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error", message: "Error on token creation" });
    }

    token = token.toString("base64");

    let { nickname } = req.body;

    nickname = GetNickname(nickname);

    const country = req.get("cf-ipcountry");

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

      item.getAllIds(async (err, itemData) => {
        if (err) {
          console.log(err);
          return res.json({
            status: "error",
            message: "Error on fetching item ids",
          });
        }

        const randomItemIdx = Math.floor(Math.random() * itemData.length);

        const currentItemId = itemData[randomItemIdx];

        try {
          const skins = await skin.findByChampionId(currentSplashChampion.id);

          if (skins.length === 0) {
            console.log(
              "FATAL: No skins found for champion ID",
              currentSplashChampion.id
            );
            return res.json({
              status: "error",
              message: "No skins found for this champion",
            });
          }

          const randomSkinIndex = Math.floor(Math.random() * skins.length);
          const randomSkin = skins[randomSkinIndex];

          oldItem.getAllIds(async (err, oldItemData) => {
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

            const abilityIds = await ability.findAllIds();
            const randomAbilityId =
              abilityIds[Math.floor(Math.random() * abilityIds.length)];

            const userData = {
              nickname: nickname,
              token: token,
              currentChampion: currentChampion.id,
              timestamp: new Date().toLocaleDateString("en"),
              country: country,
              currentItemId: currentItemId.itemId,
              currentOldItemId: currentOldItemId.id,
              currentSplashSkinId: randomSkin.id,
              currentAbilityId: randomAbilityId,
            };

            const user = await userV2.create(userData);

            res.json({ status: "success", token: token });
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            status: "error",
            message: "Error on creating user",
          });
        }
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

  user.fetchByTokenForUserDataAPI(token, (err, result) => {
    if (result && result[0][0]) {
      result[0][0]["user_rank"] = result[1][0]
        ? result[1][0]["user_rank"]
        : "n/a";
      const response = {
        status: "success",
        message: "Token is valid",
        player: result[0][0],
      };

      cache.saveCache(key, response);
      cache.changeTTL(key, 30);
      res.set("X-CACHE", "MISS");

      res.json(response);
    } else {
      if (err?.errno === -111) {
        return res
          .status(500)
          .json({ status: "error", message: "Error on fetching user" });
      } else if (!err && !result) {
        res.json({ status: "error", message: "Token is not valid" });
      } else {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "Error on fetching user",
        });
      }
    }
  });
};

const ChangeCountry = (req, res) => {
  const token = req.token;

  const country = req.get("cf-ipcountry");

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

const ChangeChampionGuess = async (req, res) => {
  try {
    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const allChampionIds = await championV2.findAllIds();
    const solvedIds = await userV2.getSolvedChampionIds(userObj.id);
    const champPool = allChampionIds.filter((id) => !solvedIds.includes(id));

    const random = Math.floor(Math.random() * champPool.length);
    const newChampionId = champPool[random];

    await userV2.updateById(userObj.id, { currentChampion: newChampionId });

    // Reset guess count in Redis
    const guessCountKey = `userId:${userObj.id}:champion:guessCount`;
    await redisCache.delete(guessCountKey);

    res.json({
      status: "success",
      message: "Changed guess to champion game",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: "Error on updating user data" });
  }
};

const ChangeSplashGuess = async (req, res) => {
  try {
    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const allChampionIds = await championV2.findAllIds();
    const solvedIds = await userV2.getSolvedSplashChampionIds(userObj.id);
    const champPool = allChampionIds.filter((id) => !solvedIds.includes(id));

    const random = Math.floor(Math.random() * champPool.length);
    const newChampionId = champPool[random];

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

    await userV2.updateById(userObj.id, { currentSplashSkinId: randomSkin.id });

    // Reset guess count in Redis
    const guessCountKey = `userId:${userObj.id}:splash:guessCount`;
    await redisCache.delete(guessCountKey);

    res.json({
      status: "success",
      message: "Changed splash guess",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: "Error on updating user data" });
  }
};

const ChangeItemGuess = async (req, res) => {
  try {
    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const allItemIds = await itemV2.findAllItemIds();
    const solvedIds = await userV2.getSolvedItemIds(userObj.id);
    const itemPool = allItemIds.filter((id) => !solvedIds.includes(id));

    const random = Math.floor(Math.random() * itemPool.length);
    const newItemId = itemPool[random];

    await userV2.updateById(userObj.id, {
      currentItemId: newItemId,
    });

    // Reset guess count in Redis
    const guessCountKey = `userId:${userObj.id}:item:guessCount`;
    await redisCache.delete(guessCountKey);

    res.json({
      status: "success",
      message: "Changed item guess",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: "Error on updating user data" });
  }
};

const ChangeOldItemGuess = async (req, res) => {
  try {
    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const allOldItemIds = await oldItemV2.findAllIds();
    const solvedIds = await userV2.getSolvedOldItemIds(userObj.id);
    const itemPool = allOldItemIds.filter((id) => !solvedIds.includes(id));

    const random = Math.floor(Math.random() * itemPool.length);
    const newOldItemId = itemPool[random];

    await userV2.updateById(userObj.id, {
      currentOldItemId: newOldItemId,
    });

    // Reset guess count in Redis
    const guessCountKey = `userId:${userObj.id}:oldItem:guessCount`;
    await redisCache.delete(guessCountKey);

    res.json({
      status: "success",
      message: "Changed old item guess",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: "Error on updating user data" });
  }
};

const ChangeAbilityGuess = async (req, res) => {
  try {
    const token = req.token;
    const userObj = await userV2.findByToken(token);
    if (!userObj) {
      return res.json({ status: "error", message: "Token is invalid" });
    }

    const allAbilityIds = await ability.findAllIds();
    const solvedIds = await userV2.getSolvedAbilityIds(userObj.id);
    const abilityPool = allAbilityIds.filter((id) => !solvedIds.includes(id));

    const random = Math.floor(Math.random() * abilityPool.length);
    const newAbilityId = abilityPool[random];

    await userV2.updateById(userObj.id, {
      currentAbilityId: newAbilityId,
    });

    // Reset guess count in Redis
    const guessCountKey = `userId:${userObj.id}:ability:guessCount`;
    await redisCache.delete(guessCountKey);

    res.json({
      status: "success",
      message: "Changed ability guess",
    });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: "Error on updating user data" });
  }
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
  ChangeOldItemGuess,
  ChangeAbilityGuess,
};
