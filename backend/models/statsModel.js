const db = require("../configs/db");

const stats = {
  create: (data, cb) => {
    db.query(
      "INSERT INTO statistics (date, dau, requests, mostActiveUsers, players, users) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.date,
        data.dau,
        data.requests,
        data.mostActiveUsers,
        data.players,
        data.users,
      ],
      cb
    );
  },
  getAll: (cb) => {
    db.query(
      "SELECT id, date, dau, requests FROM statistics ORDER BY id DESC LIMIT 30; SELECT count(*) as user_count FROM users; SELECT count(*) as player_count FROM users WHERE score > 0; SELECT count(*) as item_count FROM items; SELECT count(*) as champion_count FROM champions; SELECT skinCount FROM champions; SELECT nickname, score FROM users ORDER BY score DESC LIMIT 50; SELECT nickname, score FROM users WHERE STR_TO_DATE(timestamp, '%m/%d/%Y') = CURDATE() ORDER BY score DESC LIMIT 25; SELECT country AS Country, COUNT(id) AS Players FROM users WHERE score > 0 GROUP BY country ORDER BY Players DESC LIMIT 20; SELECT count(*) as count FROM users WHERE STR_TO_DATE(timestamp, '%m/%d/%Y') = CURDATE(); SELECT users, players, date FROM statistics ORDER BY id DESC LIMIT 30; SELECT count(*) as old_item_count FROM old_items; SELECT COUNT(*) as count FROM users WHERE STR_TO_DATE(timestamp, '%m/%d/%Y') = CURDATE() - INTERVAL 1 DAY;SELECT score_range, COUNT(*) AS Players FROM (SELECT CASE WHEN score = 0 THEN '0' WHEN score BETWEEN 1 AND 5 THEN '1-5' WHEN score BETWEEN 6 AND 10 THEN '6-10' WHEN score BETWEEN 11 AND 15 THEN '11-15' WHEN score BETWEEN 16 AND 30 THEN '16-30' WHEN score BETWEEN 31 AND 45 THEN '31-45' WHEN score BETWEEN 46 AND 60 THEN '46-60' WHEN score BETWEEN 61 AND 75 THEN '61-75' WHEN score BETWEEN 76 AND 100 THEN '76-100' WHEN score BETWEEN 101 AND 150 THEN '101-150' WHEN score BETWEEN 151 AND 200 THEN '151-200' WHEN score BETWEEN 201 AND 250 THEN '201-250' ELSE '>250' END AS score_range, score FROM users) AS subquery GROUP BY score_range ORDER BY MIN(score);",
      cb
    );
  },
  getUsersAndPlayers: (cb) => {
    db.query(
      "SELECT count(*) as user_count FROM users; SELECT count(*) as player_count FROM users WHERE score > 0;",
      cb
    );
  },
};

module.exports = stats;
