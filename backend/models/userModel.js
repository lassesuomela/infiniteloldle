const db = require('../configs/db');

const user = {
    create: (data, cb) =>{
        return db.query("INSERT INTO users (nickname, token, currentChampion, timestamp, currentSplashChampion, currentSplashId) VALUES (?, ?, ?, ?, ?, ?)", [data.nickname, data.token, data.currentChampion, data.timestamp, data.currentSplashChampion, data.currentSplashId], cb)
    },
    update: (data, cb) =>{
        return db.query("UPDATE users SET currentChampion = ?, solvedChampions = ?, prestige = ?, score = ? WHERE token = ?", [data.currentChampion, data.solvedChampions, data.prestige, data.score, data.token], cb)
    },
    updateSplash: (data, cb) =>{
        return db.query("UPDATE users SET currentSplashChampion = ?, solvedSplashChampions = ?, currentSplashId = ?, prestige = ?, score = ? WHERE token = ?", [data.currentSplashChampion, data.solvedSplashChampions, data.currentSplashId, data.prestige, data.score, data.token], cb)
    },
    fetchByToken: (token, cb) => {
        return db.query("SELECT nickname, solvedChampions, currentSplashChampion, solvedSplashChampions, timestamp, prestige, score FROM users WHERE token = ?", [token], cb)
    }
    
}

module.exports = user;
