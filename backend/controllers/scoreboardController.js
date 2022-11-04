const scoreboard = require("../models/scoreboardModel")

const TopAllTime = (req, res) => {
    scoreboard.getByScoreCount((err, result) => {

        if(!result || result.length === 0) {
            return res.json({status:"error", error:"No results found", scores: []})
        }

        res.json({status: "success", scores: result});
    })
}

module.exports = {
    TopAllTime,
}

