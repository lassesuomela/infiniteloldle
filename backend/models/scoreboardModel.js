const db = require('../configs/db');

const scorebaord = {
    getByScoreCount: (cb) =>{
        return db.query("SELECT nickname, timestamp, solvedChampion FROM users ORDER BY LENGTH(solvedChampion) DESC limit 10", cb)
    }
}

module.exports = scorebaord;