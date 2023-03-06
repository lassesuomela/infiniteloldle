const db = require('../configs/db');

const item = {
    create: (data, cb) =>{
        db.query("INSERT INTO items (name, itemId) VALUES (?, ?)", [data.name, data.id], cb)
    },
    getAllIds: (cb) =>{
        db.query("SELECT itemId FROM items", cb)
    },
    getAllNames: (cb) =>{
        db.query("SELECT name FROM items", cb)
    },
    getItemByToken: (token, cb) =>{
        db.query("SELECT itemId, name FROM items JOIN users ON items.itemId = users.currentItemId WHERE users.token = ?", [token], cb)
    },
}

module.exports = item;
