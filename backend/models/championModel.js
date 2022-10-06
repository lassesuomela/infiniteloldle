const db = require('../configs/db');

const champion = {
    create: (data, cb) =>{
        return db.query("INSERT INTO champions (name, title, resource, skinCount, spriteIds, genre) VALUES (?, ?, ?, ?, ?, ?)", [data.name, data.title, data.resource, data.skinCount, data.spriteIds, data.genre], cb)
    },
    addMoreData: (data, cb) =>{
        return db.query("UPDATE champions SET position = ?, rangeType = ?, released = ? WHERE name = ?", [data.position, data.rangeType, data.released, data.name], cb)
    }
    
}

module.exports = champion;
