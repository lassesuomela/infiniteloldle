const user = require("../models/userModel");
const champion = require("../models/championModel");
const item = require("../models/itemModel");
const crypto = require("crypto");
const geoip = require("geoip-lite");

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

          const userData = {
            nickname: nickname,
            token: token,
            currentChampion: currentChampion["id"],
            currentSplashChampion: currentSplashChampion["id"],
            currentSplashId: parseInt(randomSprite),
            timestamp: new Date().toLocaleDateString("en"),
            country: country,
            currentItemId: currentItemId["itemId"],
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
};

const CheckToken = (req, res) => {
  const token = req.token;

  user.fetchByToken(token, (err, result) => {
    if (result && result[0]) {
      delete result[0]["solvedChampions"];
      delete result[0]["currentSplashChampion"];
      delete result[0]["solvedSplashChampions"];
      delete result[0]["solvedItemIds"];
      delete result[0]["currentItemId"];

      res.json({
        status: "success",
        message: "Token is valid",
        player: result[0],
      });
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

module.exports = {
  Create,
  CheckToken,
  ChangeNickname,
  DeleteUser,
  ChangeCountry,
};
