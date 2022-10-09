const db = require('../configs/db');

const user = {
    create: (data, cb) =>{
        return db.query("INSERT INTO users (nickname, token, currentChampion, timestamp, ip) VALUES (?, ?, ?, ?, ?)", [data.nickname, data.token, data.currentChampion, data.timestamp, data.ip], cb)
    },
    update: (data, cb) =>{
        return db.query("UPDATE users SET currentChampion = ?, solvedChampion = ? WHERE token = ?", [data.currentChampion, data.solvedChampions, data.token], cb)
    },
    fetchByToken: (token, cb) => {
        return db.query("SELECT currentChampion, solvedChampion FROM users WHERE token = ?", [token], cb)
    }
    
}

module.exports = user;
