const db = require('../configs/db');

const champion = {
    create: (data, cb) =>{
        return db.query("INSERT INTO champions (name, title, resource, skinCount, spriteIds, genre, gender) VALUES (?, ?, ?, ?, ?, ?, ?)", [data.name, data.title, data.resource, data.skinCount, data.spriteIds, data.genre, data.gender], cb)
    },
    addMoreData: (data, cb) =>{
        return db.query("UPDATE champions SET position = ?, rangeType = ?, released = ?, region = ? WHERE name = ?", [data.position, data.rangeType, data.released, data.region, data.name], cb)
    },
    getAllIds: (cb) =>{
        return db.query("SELECT id FROM champions", cb)
    },
    getByToken: (token, cb) =>{
        return db.query("SELECT users.currentChampion, champions.name, champions.resource, champions.position, champions.gender, champions.rangeType, champions.released, champions.region, champions.genre FROM users JOIN champions ON champions.id = users.currentChampion WHERE users.token = ?", [token], cb)
    },
    getByName: (name, cb) =>{
        return db.query("SELECT * FROM champions WHERE name = ?", [name], cb)
    }
}

module.exports = champion;
