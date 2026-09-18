const db = require("../configs/db");

const user = {
  update: (data, cb) => {
    return db.query(
      "UPDATE users SET currentChampion = ?, solvedChampions = ? WHERE token = ?",
      [data.currentChampion, data.solvedChampions, data.token],
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
