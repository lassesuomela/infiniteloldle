const db = require('../configs/db');

const champion = {
    add: (data, cb) =>{
        return db.query("INSERT INTO champions (name, title, resource, skinCount, spriteIds, genre) VALUES (?, ?, ?, ?, ?, ?)", [data.name, data.title, data.resource, data.skinCount, data.spriteIds, data.genre], cb)
    },
    addMoreData: (data, cb) =>{
        return db.query("UPDATE champion SET position = ?, gender = ?, rangeType = ? region = ?, released = ?, species = ? WHERE champion.name = ?", [data.position, data.gender, data.rangeType, data.region, data.released, data.species, data.name], cb)
    }
    
}

module.exports = champion;
