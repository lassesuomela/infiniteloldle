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

            console.log(score);

            data["score"] = score;
            delete data["solvedChampion"];
        })

        console.log(result);

        res.json({status: "success", scores: result});
    })
}

module.exports = {
    TopAllTime,
}

