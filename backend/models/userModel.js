const db = require('../configs/db');

const user = {
    create: (data, cb) =>{
        return db.query("INSERT INTO users (nickname, token, currentChampion, timestamp) VALUES (?, ?, ?, ?)", [data.nickname, data.token, data.currentChampion, data.timestamp], cb)
    },
    update: (data, cb) =>{
        return db.query("UPDATE users SET currentChampion = ?, solvedChampions = ? WHERE token = ?", [data.currentChampion, data.solvedChampions, data.token], cb)
    },
    fetchByToken: (token, cb) => {
        return db.query("SELECT nickname, solvedChampions, timestamp FROM users WHERE token = ?", [token], cb)
    }
    
}

module.exports = user;
