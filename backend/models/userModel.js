const db = require("../configs/db");

const user = {
  update: (data, cb) => {
    return db.query(
      "UPDATE users SET currentChampion = ?, prestige = ?, score = ? WHERE token = ?",
      [data.currentChampion, data.prestige, data.score, data.token],
      cb
    );
  },
  fetchByTokenForUserDataAPI: (token, cb) => {
    return db.query(
      "SELECT nickname, timestamp, prestige, score, country FROM users WHERE token = ?; SELECT user_rank FROM (SELECT token, DENSE_RANK() OVER (ORDER BY score DESC) AS user_rank FROM users WHERE score > 0) AS ranked_users WHERE token = ?;",
      [token, token],
      cb
    );
  },
  changeNickname: (data, cb) => {
    return db.query(
      "UPDATE users SET nickname = ? WHERE token = ?",
      [data.nickname, data.token],
      cb
    );
  },
  deleteUser: (token, cb) => {
    return db.query("DELETE FROM users WHERE token = ?", [token], cb);
  },
  setCountry: (data, cb) => {
    return db.query(
      "UPDATE users SET country = ? WHERE token = ?",
      [data.country, data.token],
      cb
    );
  },
  updateItem: (data, cb) => {
    return db.query(
      "UPDATE users SET currentItemId = ?, solvedItemIds = ?, prestige = ?, score = ? WHERE token = ?",
      [
        data.currentItemId,
        data.solvedItemIds,
        data.prestige,
        data.score,
        data.token,
      ],
      cb
    );
  },
  updateOldItem: (data, cb) => {
    return db.query(
      "UPDATE users SET currentOldItemId = ?, solvedOldItemIds = ?, prestige = ?, score = ? WHERE token = ?",
      [
        data.currentOldItemId,
        data.solvedOldItemIds,
        data.prestige,
        data.score,
        data.token,
      ],
      cb
    );
  },
};

module.exports = user;
