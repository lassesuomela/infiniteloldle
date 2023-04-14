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
    db.query("SELECT * FROM statistics LIMIT 30; SELECT count(*) as user_count FROM users; SELECT count(*) as player_count FROM users WHERE score > 0; SELECT count(*) as item_count FROM items; SELECT count(*) as champion_count FROM champions; SELECT skinCount FROM champions; SELECT nickname, score FROM users ORDER BY score DESC LIMIT 50;", cb);
  },
};

module.exports = stats;
