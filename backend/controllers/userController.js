const user = require("../models/userModel")
const champion = require("../models/championModel")
const crypto = require("crypto")

const Create = (req, res) => {

    const ip = req.ip || req.socket.remoteAddress || null;

    console.log(req.body);

    crypto.randomBytes(46, (err, token) => {
        if(err) {
            console.log(err);
            return res.json({status:"error", message:"Error on token creation"})
        }

        token = token.toString("base64");

        let {nickname} = req.body;

        if(nickname.length > 30){
            nickname = nickname.substring(0,30);
        }

        champion.getAllIds((err, data) => {
            if(err) {
                console.log(err);
                return res.json({status:"error", message:"Error on fetching ids"})
            }

            const random = Math.floor(Math.random() * data.length);

            const currentChampion = data[random];

            data = {
                nickname: !nickname ? "Anonymous" : nickname,
                token: token,
                currentChampion: currentChampion["id"],
                timestamp: new Date().toLocaleDateString("en"),
                ip: ip[0]
            }

            console.log(data);
        
            user.create(data, (err, result) => {

                if(err) {
                    console.log(err);
                    return res.json({status:"error", message:"Error on fetching ids"})
                }

                res.json({status: "success", token: token})
            })
        })
    })
}

const CheckToken = (req, res) => {

    const token = req.token;

    user.fetchByToken(token, (err, result) => {
        if (result && result[0]){

            result.forEach(result => {

                let score;
                if(result.solvedChampion && result.solvedChampion.length > 1){
                    score = result.solvedChampion.split(",").length;
                }else{
                    score = 0;
                }
    
                result["score"] = score;
                delete result["solvedChampion"];
            })

            res.json({status:"success", message:"Token is valid", player: result[0]})
        }else{
            res.json({status:"error", message:"Token is not valid"})
        }
    })
}

module.exports = {
    Create,
    CheckToken
}

