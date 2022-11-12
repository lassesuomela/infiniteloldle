const user = require("../models/userModel")
const champion = require("../models/championModel")
const crypto = require("crypto")

const Create = (req, res) => {

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

            const randomSplash = Math.floor(Math.random() * data.length);

            const currentSplashChampion = data[randomSplash];

            champion.getSplashById(currentSplashChampion["id"], (err, result) => {

                if(err) {
                    console.log(err);
                    return res.json({status:"error", message:"Error on fetching splash art ids"})
                }

                const sprites = result[0]["spriteIds"].split(",");

                const randomSpriteId = Math.floor(Math.random() * sprites.length);

                const randomSprite = sprites[randomSpriteId];

                data = {
                    nickname: !nickname ? "Anonymous" : nickname,
                    token: token,
                    currentChampion: currentChampion["id"],
                    currentSplashChampion: currentSplashChampion["id"],
                    currentSplashId: parseInt(randomSprite),
                    timestamp: new Date().toLocaleDateString("en")
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
    })
}

const CheckToken = (req, res) => {

    const token = req.token;

    user.fetchByToken(token, (err, result) => {
        if (result && result[0]){

            delete result[0]["solvedChampions"];

            res.json({status:"success", message:"Token is valid", player: result[0]})
        }else{
            res.json({status:"error", message:"Token is not valid"})
        }
    })
}

const ChangeNickname = (req, res) => {

    let { nickname } = req.body;

    if(!nickname) {
        return res.json({status: "error", message: "Nickname is required"})
    }

    if(nickname.length > 30){
        nickname = nickname.substring(0,30);
    }

    const data = {
        nickname: nickname,
        token: req.token,
    }

    user.changeNickname(data, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({status:"error", message:"Error on changing nickname"})
        }

        if(result.affectedRows !== 0){

            return res.json({status: "success", message:"Nickname updated"})
        }else{
            return res.json({status: "error", message:"No user was found with that token"})

        }
    })
}

const DeleteUser = (req, res) => {

    user.deleteUser(req.token, (err, result) => {
        if(err) {
            console.log(err);
            return res.json({status:"error", message:"Error on deleting account"})
        }

        if(result.affectedRows !== 0){

            return res.json({status: "success", message:"Account deleted"})
        }else{
            return res.json({status: "error", message:"No user was found with that token"})
        }
    })
}

module.exports = {
    Create,
    CheckToken,
    ChangeNickname,
    DeleteUser
}

