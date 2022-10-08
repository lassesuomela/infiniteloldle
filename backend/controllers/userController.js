const user = require("../models/userModel")
const champion = require("../models/championModel")
const crypto = require("crypto")

const Create = (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    crypto.randomBytes(46, (err, token) => {
        if(err) {
            console.log(err);
            return res.json({status:"error",message:"Error on token creation"})
        }

        token = token.toString("base64");

        const {nickname} = req.body;

        champion.getAllIds((err, data) => {
            if(err) {
                console.log(err);
                return res.json({status:"error",message:"Error on fetching ids"})
            }

            const random = Math.floor(Math.random() * data.length);

            const currentChampion = data[random];

            data = {
                nickname: !nickname ? "Anonymous" : nickname,
                token: token,
                currentChampion:currentChampion["id"],
                timestamp: new Date().toLocaleDateString("en"),
                ip: ip
            }

            console.log(data);
        
            user.create(data, (err, result) => {

                if(err) {
                    console.log(err);
                    return res.json({status:"error",message:"Error on fetching ids"})
                }

                res.json({status: "success", token: token})
            })
        })
    })
}

const CheckToken = (req, res) => {
    let token = req.headers.authorization;

    if (token){
        token = token.split(" ")[1];
    }else{
        return res.json({status:"error", message:"Token must be provided"})
    }

    user.fetchByToken(token, (err, result) => {
        if (result[0]){
            res.json({status:"success", message:"Token is valid"})
        }else{
            res.json({status:"error", message:"Token is not valid"})
        }
    })
}

module.exports = {
    Create,
    CheckToken
}

