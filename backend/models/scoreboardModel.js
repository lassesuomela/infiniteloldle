const db = require("../configs/db");

const scorebaord = {
  getByScoreCount: (cb) => {
    return db.query(
      "SELECT nickname, timestamp, score, prestige, country FROM users ORDER BY score DESC limit 10; SELECT COUNT(id) AS registered_count FROM users; SELECT count(id) as player_count FROM users WHERE score > 0",
      cb
    );
  },
};

module.exports = scorebaord;
