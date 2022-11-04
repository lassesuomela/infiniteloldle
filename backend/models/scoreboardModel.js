const db = require('../configs/db');

const scorebaord = {
    getByScoreCount: (cb) =>{
        return db.query("SELECT nickname, timestamp, score, prestige FROM users ORDER BY score DESC limit 10", cb)
    }
}

module.exports = scorebaord;
