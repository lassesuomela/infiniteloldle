const db = require('../configs/db');

const champion = {
    add: (data, cb) =>{
        return db.query("INSERT INTO champions (name, title, resource, skinCount, spriteIds) VALUES (?, ?, ?, ?, ?)", [data.name, data.title, data.resource, data.skinCount, data.spriteIds], cb)
    }
}

module.exports = champion;
