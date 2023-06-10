const statsModel = require("../models/statsModel");
const cache = require("./cache");

let ips = [];
const stats = {};

const track = (req, res, next) => {
  const host = req.ip;

  if (stats["dau"] === undefined) {
    stats["dau"] = 0;
  }
  if (stats["requests"] === undefined) {
    stats["requests"] = 0;
  }

  if (ips.indexOf(host) === -1) {
    stats["dau"] += 1;
    ips.push(host);
  }

  stats["requests"] += 1;

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
      ips = [];
    });
  });
};

module.exports = { track, saveStats };
