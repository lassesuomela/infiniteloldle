const db = require('../configs/db');

const champion = {
    create: (data, cb) =>{
        return db.query("INSERT INTO champions (name, title, resource, skinCount, spriteIds, genre, gender) VALUES (?, ?, ?, ?, ?, ?, ?)", [data.name, data.title, data.resource, data.skinCount, data.spriteIds, data.genre, data.gender], cb)
    },
    addMoreData: (data, cb) =>{
        return db.query("UPDATE champions SET position = ?, rangeType = ?, released = ?, region = ? WHERE name = ?", [data.position, data.rangeType, data.released, data.region, data.name], cb)
    }
    
}

module.exports = champion;
