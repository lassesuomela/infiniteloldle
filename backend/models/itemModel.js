const db = require('../configs/db');

const item = {
    create: (data, cb) =>{
        db.query("INSERT INTO items (name, itemId) VALUES (?, ?)", [data.name, data.id], cb)
    }
    
}

module.exports = item;
