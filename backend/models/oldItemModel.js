const db = require("../configs/db");

const oldItem = {
  getAllNames: (cb) => {
    db.query("SELECT name FROM old_items", cb);
  },
  getItemByToken: (token, cb) => {
    db.query(
      "SELECT old_items.id, old_items.name, old_items.old_item_key FROM old_items JOIN users ON old_items.id = users.currentOldItemId WHERE users.token = ?",
      [token],
      cb
    );
  },
  getIdByName: (name, cb) => {
    db.query("SELECT old_item_key FROM old_items WHERE name = ?", [name], cb);
  },
  getNameById: (id, cb) => {
    db.query("SELECT name FROM old_items WHERE id = ?", [id], cb);
  },
  getAllIds: (cb) => {
    db.query("SELECT id FROM old_items", cb);
  },
};

module.exports = oldItem;
