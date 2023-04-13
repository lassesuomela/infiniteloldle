const db = require("../configs/db");
const statsModel = require("../models/statsModel");

let ips = [];
const stats = {};

let startDate = new Date();

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

  console.log(stats);

  console.log(startDate);
  console.log(new Date(new Date() + (new Date() - startDate)));

  const diff = new Date(new Date() + (new Date() - startDate)) - startDate;

  console.log(diff);

  if (diff > 86400000) {
    // save to db after n seconds day = 86400000
    console.log("Saving to db");

    startDate = new Date();

    const data = {
      date: new Date(),
      dau: stats["dau"],
      requests: stats["requests"],
      mostActiveUsers: [].join(", ").toString(),
    };

    console.log(data);
    // reset
    stats["dau"] = 0;
    stats["requests"] = 0;
    ips = [];

    statsModel.create(data, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("Success on saving stats to db");
    });
  }
  next();
};

module.exports = track;
