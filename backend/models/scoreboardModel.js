const db = require('../configs/db');

const scorebaord = {
    getByScoreCount: (cb) =>{
        return db.query("SELECT nickname, timestamp, score, prestige, country FROM users ORDER BY score DESC limit 10; SELECT COUNT(id) AS 'playerCount' FROM users", cb)
    }
}

module.exports = scorebaord;
