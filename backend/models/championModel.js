const db = require('../configs/db');

const champion = {
    create: (data, cb) =>{
        return db.query("INSERT INTO champions (name, title, resource, skinCount, spriteIds, genre, gender) VALUES (?, ?, ?, ?, ?, ?, ?)", [data.name, data.title, data.resource, data.skinCount, data.spriteIds, data.genre, data.gender], cb)
    },
    addMoreData: (data, cb) =>{
        return db.query("UPDATE champions SET damageType = ?, position = ?, rangeType = ?, released = ?, region = ? WHERE name = ?", [data.damageType, data.position, data.rangeType, data.released, data.region, data.name], cb)
    },
    addChampionId: (data, cb) =>{
        return db.query("UPDATE champions SET championKey = ? WHERE name = ?", [data.key, data.name], cb)
    },
    getAllIds: (cb) =>{
        return db.query("SELECT id FROM champions", cb)
    },
    getAllNames: (cb) =>{
        return db.query("SELECT name FROM champions", cb)
    },
    getByToken: (token, cb) =>{
        return db.query("SELECT users.currentChampion, champions.id, champions.name, champions.title, champions.resource, champions.position, champions.gender, champions.rangeType, champions.released, champions.region, champions.genre, champions.damageType FROM users JOIN champions ON champions.id = users.currentChampion WHERE users.token = ?", [token], cb)
    },
    getSplashByToken: (token, cb) =>{
        return db.query("SELECT users.currentSplashChampion, champions.id, champions.name, champions.title FROM users JOIN champions ON champions.id = users.currentSplashChampion WHERE users.token = ?", [token], cb)
    },
    getByName: (name, cb) =>{
        return db.query("SELECT * FROM champions WHERE name = ?", [name], cb)
    },
    getSplashById: (id, cb) =>{
        return db.query("SELECT spriteIds FROM champions where id = ?", [id], cb)
    }
}

module.exports = champion;
