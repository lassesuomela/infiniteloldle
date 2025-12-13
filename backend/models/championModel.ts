const db = require("../configs/db");

const champion = {
  getAllIds: (cb) => {
    db.query("SELECT id FROM champions", cb);
  },
  getAllNames: (cb) => {
    db.query("SELECT name FROM champions", cb);
  },
  getAllNamesAndKeys: (cb) => {
    db.query("SELECT name, championKey FROM champions", cb);
  },
  getByToken: (token, cb) => {
    db.query(
      "SELECT users.currentChampion, champions.id, champions.name, champions.title, champions.resource, champions.position, champions.gender, champions.rangeType, champions.released, champions.region, champions.genre, champions.damageType FROM users JOIN champions ON champions.id = users.currentChampion WHERE users.token = ?",
      [token],
      cb
    );
  },
  getByName: (name, cb) => {
    db.query("SELECT * FROM champions WHERE name = ?", [name], cb);
  },
  getNameById: (id, cb) => {
    db.query("SELECT name FROM champions WHERE id = ?", [id], cb);
  },
};

module.exports = champion;
