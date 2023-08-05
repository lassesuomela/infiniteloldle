const db = require("../configs/db");

const user = {
  create: (data, cb) => {
    return db.query(
      "INSERT INTO users (nickname, token, currentChampion, timestamp, currentSplashChampion, currentSplashId, country, currentItemId, currentOldItemId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.nickname,
        data.token,
        data.currentChampion,
        data.timestamp,
        data.currentSplashChampion,
        data.currentSplashId,
        data.country,
        data.currentItemId,
        data.currentOldItemId,
      ],
      cb
    );
  },
  update: (data, cb) => {
    return db.query(
      "UPDATE users SET currentChampion = ?, solvedChampions = ?, prestige = ?, score = ? WHERE token = ?",
      [
        data.currentChampion,
        data.solvedChampions,
        data.prestige,
        data.score,
        data.token,
      ],
      cb
    );
  },
  updateSplash: (data, cb) => {
    return db.query(
      "UPDATE users SET currentSplashChampion = ?, solvedSplashChampions = ?, currentSplashId = ?, prestige = ?, score = ? WHERE token = ?",
      [
        data.currentSplashChampion,
        data.solvedSplashChampions,
        data.currentSplashId,
        data.prestige,
        data.score,
        data.token,
      ],
      cb
    );
  },
  fetchByTokenForUserDataAPI: (token, cb) => {
    return db.query(
      "SELECT nickname, solvedChampions, currentSplashChampion, solvedSplashChampions, timestamp, prestige, score, country, currentItemId, solvedItemIds, currentOldItemId, solvedOldItemIds FROM users WHERE token = ?; SELECT user_rank FROM (SELECT token, DENSE_RANK() OVER (ORDER BY score DESC) AS user_rank FROM users WHERE score > 0) AS ranked_users WHERE token = ?;",
      [token, token],
      cb
    );
  },
  fetchByToken: (token, cb) => {
    return db.query(
      "SELECT nickname, solvedChampions, currentSplashChampion, solvedSplashChampions, timestamp, prestige, score, country, currentItemId, solvedItemIds, currentOldItemId, solvedOldItemIds FROM users WHERE token = ?;",
      [token],
      cb
    );
  },
  fetchSplashArtByToken: (token, cb) => {
    return db.query(
      "SELECT users.currentSplashId, champions.championKey FROM users JOIN champions ON champions.id = users.currentSplashChampion WHERE token = ?",
      [token],
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
