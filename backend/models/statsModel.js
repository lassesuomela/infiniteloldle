const db = require("../configs/db");

const stats = {
  create: (data, cb) => {
    db.query(
      "INSERT INTO statistics (date, dau, requests, mostActiveUsers) VALUES (?, ?, ?, ?)",
      [data.date, data.dau, data.requests, data.mostActiveUsers],
      cb
    );
  },
  getAll: (cb) => {
    db.query("SELECT * FROM statistics", cb);
  },
};

module.exports = stats;
