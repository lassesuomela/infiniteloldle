const statsModel = require("../models/statsModel");
const cache = require("./cache");

let tokens = [];
const stats = {};

const trackRequests = (req, res, next) => {
  if (stats["requests"] === undefined) {
    stats["requests"] = 0;
  }

  stats["requests"] += 1;
  next();
};

const trackDAU = (req, res, next) => {
  if (stats["dau"] === undefined) {
    stats["dau"] = 0;
  }

  if (req.token !== undefined && req.token !== null) {
    const token = req.token.substring(0, 20);

    let reqsByToken = cache.getCache(token);

    if (reqsByToken === undefined) {
      reqsByToken = {};
    }

    if (reqsByToken["requests"] === undefined) {
      reqsByToken["requests"] = 0;
    }

    if (reqsByToken["token"] === undefined) {
      reqsByToken["token"] = token;
    }

    reqsByToken["requests"] += 1;

    if (reqsByToken["timeBetweenReqs"] === undefined) {
      reqsByToken["timeBetweenReqs"] = {
        current: new Date(),
        previous: null,
        difference: null,
        differences: [],
      };
    } else {
      reqsByToken["timeBetweenReqs"]["previous"] =
        reqsByToken["timeBetweenReqs"]["current"];
      reqsByToken["timeBetweenReqs"]["current"] = new Date();

      const previousTime = reqsByToken["timeBetweenReqs"]["previous"];
      const currentTime = reqsByToken["timeBetweenReqs"]["current"];
      const timeDiff = (currentTime - previousTime) / 1000;

      reqsByToken["timeBetweenReqs"]["difference"] = timeDiff;

      if (reqsByToken["timeBetweenReqs"]["difference"] !== undefined) {
        reqsByToken["timeBetweenReqs"]["differences"].push(timeDiff);

        if (reqsByToken["timeBetweenReqs"]["differences"].length > 10) {
          reqsByToken["timeBetweenReqs"]["differences"].shift();
        }

        const averages = reqsByToken["timeBetweenReqs"]["differences"];
        const sum = averages.reduce((total, timeDiff) => total + timeDiff, 0);
        const averageTime = sum / averages.length;

        reqsByToken["timeBetweenReqs"]["average"] = averageTime;
      }

      reqsByToken["isLikelyBot"] =
        reqsByToken["timeBetweenReqs"]["average"] < 0.8 ? true : false;
    }

    console.log(reqsByToken);
    cache.saveCache(token, reqsByToken);

    if (tokens.indexOf(token) === -1) {
      stats["dau"] += 1;
      tokens.push(token);
    }
  }

  next();
};

const saveStats = () => {
  // save to db at 23:55
  console.log("Saving to db");

  statsModel.getUsersAndPlayers((err, data2) => {
    if (err) {
      console.log(err);
    }

    const data = {
      date: new Date(),
      dau: stats["dau"],
      requests: stats["requests"],
      mostActiveUsers: [].join(", ").toString(),
      users: data2[0][0].user_count,
      players: data2[1][0].player_count,
    };

    statsModel.create(data, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("Successfully saved stats to db");

      cache.deleteCache("/stats");
      // reset
      stats["dau"] = 0;
      stats["requests"] = 0;
      tokens = [];
    });
  });
};

module.exports = { trackRequests, saveStats, trackDAU };
