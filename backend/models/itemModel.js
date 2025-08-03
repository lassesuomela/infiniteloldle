const db = require("../configs/db");

const item = {
  getAllIds: (cb) => {
    db.query("SELECT itemId FROM items", cb);
  },
  getAllNames: (cb) => {
    db.query("SELECT name FROM items", cb);
  },
  getItemByToken: (token, cb) => {
    db.query(
      "SELECT itemId, name FROM items JOIN users ON items.itemId = users.currentItemId WHERE users.token = ?",
      [token],
      cb
    );
  },
  getIdByName: (name, cb) => {
    db.query("SELECT itemId FROM items WHERE name = ?", [name], cb);
  },
  getNameById: (id, cb) => {
    db.query("SELECT name FROM items WHERE itemId = ?", [id], cb);
  },
};

module.exports = item;
