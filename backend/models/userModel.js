const db = require('../configs/db');

const user = {
    create: (data, cb) =>{
        return db.query("INSERT INTO users (nickname, token, currentChampion, timestamp, currentSplashChampion, currentSplashId, country, currentItemId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [data.nickname, data.token, data.currentChampion, data.timestamp, data.currentSplashChampion, data.currentSplashId, data.country, data.currentItemId], cb)
    },
    update: (data, cb) =>{
        return db.query("UPDATE users SET currentChampion = ?, solvedChampions = ?, prestige = ?, score = ? WHERE token = ?", [data.currentChampion, data.solvedChampions, data.prestige, data.score, data.token], cb)
    },
    updateSplash: (data, cb) =>{
        return db.query("UPDATE users SET currentSplashChampion = ?, solvedSplashChampions = ?, currentSplashId = ?, prestige = ?, score = ? WHERE token = ?", [data.currentSplashChampion, data.solvedSplashChampions, data.currentSplashId, data.prestige, data.score, data.token], cb)
    },
    fetchByToken: (token, cb) => {
        return db.query("SELECT nickname, solvedChampions, currentSplashChampion, solvedSplashChampions, timestamp, prestige, score, country, currentItemId, solvedItemIds FROM users WHERE token = ?", [token], cb)
    },
    fetchSplashArtByToken: (token, cb) => {
        return db.query("SELECT users.currentSplashId, champions.championKey FROM users JOIN champions ON champions.id = users.currentSplashChampion WHERE token = ?", [token], cb)
    },
    changeNickname: (data, cb) => {
        return db.query("UPDATE users SET nickname = ? WHERE token = ?", [data.nickname, data.token], cb)
    },
    deleteUser: (token, cb) => {
        return db.query("DELETE FROM users WHERE token = ?", [token], cb)
    },
    setCountry: (data, cb) => {
        return db.query("UPDATE users SET country = ? WHERE token = ?", [data.country, data.token], cb)
    },
    updateItem: (data, cb) =>{
        return db.query("UPDATE users SET currentItemId = ?, solvedItemIds = ?, prestige = ?, score = ? WHERE token = ?", [data.currentItemId, data.solvedItemIds, data.prestige, data.score, data.token], cb)
    },
}

module.exports = user;
