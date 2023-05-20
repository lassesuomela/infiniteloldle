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
  // save to db at 00:00
  console.log("Saving to db");

  const data = {
    date: new Date(),
    dau: stats["dau"],
    requests: stats["requests"],
    mostActiveUsers: [].join(", ").toString(),
  };

  cache.deleteCache("/stats");
  // reset
  stats["dau"] = 0;
  stats["requests"] = 0;
  ips = [];

  statsModel.create(data, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("Successfully saved stats to db");
  });
};

module.exports = { track, saveStats };
