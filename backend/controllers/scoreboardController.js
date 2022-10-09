const scoreboard = require("../models/scoreboardModel")

const TopAllTime = (req, res) => {
    scoreboard.getByScoreCount((err, result) => {
        result.forEach(data => {

            let score;
            if(data.solvedChampion && data.solvedChampion.length > 1){
                score = data.solvedChampion.split(",").length;
            }else{
                score = 1;
            }

            data["score"] = score;
            delete data["solvedChampion"];
        })

        res.json({status: "success", scores: result});
    })
}

module.exports = {
    TopAllTime,
}

