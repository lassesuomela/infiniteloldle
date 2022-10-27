const scoreboard = require("../models/scoreboardModel")

const TopAllTime = (req, res) => {
    scoreboard.getByScoreCount((err, result) => {

        if(!result){
            res.json({status:"error", error:"No results found", scores: []})
        }

        result.forEach(data => {

            let score;
            if(data.solvedChampion && data.solvedChampion.length > 1){
                score = data.solvedChampion.split(",").length;
            }else{
                score = 0;
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

