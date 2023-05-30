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
    db.query(
      "SELECT * FROM statistics ORDER BY id DESC LIMIT 30; SELECT count(*) as user_count FROM users; SELECT count(*) as player_count FROM users WHERE score > 0; SELECT count(*) as item_count FROM items; SELECT count(*) as champion_count FROM champions; SELECT skinCount FROM champions; SELECT nickname, score FROM users ORDER BY score DESC LIMIT 50; SELECT nickname, score FROM users WHERE STR_TO_DATE(timestamp, '%m/%d/%Y') = CURDATE() ORDER BY score DESC LIMIT 25; SELECT country AS Country, COUNT(id) AS Players FROM users GROUP BY country ORDER BY Players DESC LIMIT 20; SELECT count(*) as count FROM users WHERE STR_TO_DATE(timestamp, '%m/%d/%Y') = CURDATE();",
      cb
    );
  },
};

module.exports = stats;
