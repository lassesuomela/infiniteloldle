const db = require("../configs/db");

const champion = {
  create: (data, cb) => {
    db.query(
      "INSERT INTO champions (name, title, resource, skinCount, spriteIds, genre, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.title,
        data.resource,
        data.skinCount,
        data.spriteIds,
        data.genre,
        data.gender,
      ],
      cb
    );
  },
  addMoreData: (data, cb) => {
    db.query(
      "UPDATE champions SET damageType = ?, position = ?, rangeType = ?, released = ?, region = ? WHERE name = ?",
      [
        data.damageType,
        data.position,
        data.rangeType,
        data.released,
        data.region,
        data.name,
      ],
      cb
    );
  },
  addChampionId: (data, cb) => {
    db.query(
      "UPDATE champions SET championKey = ? WHERE name = ?",
      [data.key, data.name],
      cb
    );
  },
  getAllIds: (cb) => {
    db.query("SELECT id FROM champions", cb);
  },
  getAllNames: (cb) => {
    db.query("SELECT name FROM champions", cb);
  },
  getAllNamesAndKeys: (cb) => {
    db.query("SELECT name, championKey FROM champions", cb);
  },
  getAllKeys: (cb) => {
    db.query("SELECT championKey, spriteIds FROM champions", cb);
  },
  getByToken: (token, cb) => {
    db.query(
      "SELECT users.currentChampion, champions.id, champions.name, champions.title, champions.resource, champions.position, champions.gender, champions.rangeType, champions.released, champions.region, champions.genre, champions.damageType FROM users JOIN champions ON champions.id = users.currentChampion WHERE users.token = ?",
      [token],
      cb
    );
  },
  getSplashByToken: (token, cb) => {
    db.query(
      "SELECT users.currentSplashChampion, champions.id, champions.name, champions.title FROM users JOIN champions ON champions.id = users.currentSplashChampion WHERE users.token = ?",
      [token],
      cb
    );
  },
  getByName: (name, cb) => {
    db.query("SELECT * FROM champions WHERE name = ?", [name], cb);
  },
  getSplashById: (id, cb) => {
    db.query("SELECT spriteIds FROM champions where id = ?", [id], cb);
  },
  getNameById: (id, cb) => {
    db.query("SELECT name FROM champions WHERE id = ?", [id], cb);
  },
};

module.exports = champion;
