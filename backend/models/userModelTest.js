const db = require("../configs/db");

const user = {
  update: (data, cb) => {
    return db.query(
      "UPDATE users SET currentChampion = ?, solvedChampions = ? WHERE token = ?",
      [data.currentChampion, data.solvedChampions, data.token],
      cb
    );
  },
  updateSplash: (data, cb) => {
    return db.query(
      "UPDATE users SET currentSplashChampion = ?, solvedSplashChampions = ? WHERE token = ?",
      [data.currentSplashChampion, data.solvedSplashChampions, data.token],
      cb
    );
  },
  fetchByToken: (token, cb) => {
    return db.query(
      "SELECT nickname, currentSplashChampion, timestamp, prestige, score, country, currentItemId, currentOldItemId FROM users WHERE token = ?;",
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
  updateItem: (data, cb) => {
    return db.query(
      "UPDATE users SET currentItemId = ?, solvedItemIds = ? WHERE token = ?",
      [data.currentItemId, data.solvedItemIds, data.token],
      cb
    );
  },
  updateOldItem: (data, cb) => {
    return db.query(
      "UPDATE users SET currentOldItemId = ?, solvedOldItemIds = ? WHERE token = ?",
      [data.currentOldItemId, data.solvedOldItemIds, data.token],
      cb
    );
  },
};

module.exports = user;
