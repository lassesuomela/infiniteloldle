const champion = require("../models/championModel")
const user = require("../models/userModel")

const Create = (req, res) => {

    const data = req.body;

    if(!data.name || !data.title || !data.resource || !data.skinCount || !data.spriteIds || !data.genre || !data.gender){
        return res.json({ status:"error", message:"One or more fields must be provided"})
    }

    champion.create(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }

        res.json({status: "success", message: "Champion added successfully"})
    })
}

const AddMoreData = (req, res) => {
    const body = req.body;

    const data = {
        name: body.champion,
        released: body.data[0].released.toString(),
        region: body.data[1].region.toString(),
        position: body.data[2].positions.toString(),
        rangeType: body.data[3].rangeTypes.toString()
    }

    if(!data.position || !data.rangeType || !data.released || !data.name || !data.region){
        return res.json({ status:"error", message:"One or more fields must be provided"})
    }

    champion.addMoreData(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }
        res.json({status: "success", message: "Champion edited"})
    })
}

const Guess = (req, res) => {

    const { guess } = req.body;
    let token = req.headers.authorization;

    if(token){
        token = token.split(" ")[1];
    }else{
        return res.json({status: "error", message:"Token is needed"})
    }

    champion.getByToken(token, (err, correctChampionData) => {

        if(!correctChampionData[0]){
            return res.json({status: "error", message: "Nothing found with that token"})
        }

        if(guess === correctChampionData[0].name){
            // add champ id to solved champions in this token and fetch new one

            champion.getAllIds((err, data) => {
                if(err) {
                    console.log(err);
                    return res.json({status: "error",message: "Error on fetching ids"})
                }

                user.fetchByToken(token, (err, result) => {

                    if(err) {
                        console.log(err);
                        return res.json({status: "error",message: "Error on fetching with token"})
                    }

                    let solvedChampions;

                    if(result[0]["solvedChampion"]){
                        solvedChampions = correctChampionData[0]["id"] + "," + result[0]["solvedChampion"];
                    }else{
                        solvedChampions = correctChampionData[0]["id"];
                    }

                    const solvedChamps = solvedChampions.split(",");

                    // remove solved champs from the all champions pool
                    const champPool = data.filter(id => {
                        return !solvedChamps.includes(id["id"].toString());
                    })

                    const random = Math.floor(Math.random() * champPool.length);
        
                    const newChampion = champPool[random];

                    let payload = {
                        currentChampion: newChampion["id"],
                        solvedChampions: solvedChampions,
                        token: token
                    }

                    user.update(payload, (err, result) => {
    
                        if(err) {
                            console.log(err);
                            return res.json({status: "error",message: "Error on fetching ids"})
                        }
        
                        res.json({status: "success", correctGuess: true})
                    })
                })
            })
        }else{
            // wrong guess return diff

            champion.getByName(guess, (err, guessChampionData) => {

                if (!guessChampionData[0]){
                    return res.json({ status: "error", message:"Nothing found with that name"})
                }

                const data = {
                    guessedChampion: guessChampionData[0].name,
                    
                    resource: guessChampionData[0].resource,
                    sameResource: guessChampionData[0].resource === correctChampionData[0].resource ? "true" : "false",
                    
                    position: guessChampionData[0].position,
                    samePosition: guessChampionData[0].position === correctChampionData[0].position ? "true" : "false",
                    
                    rangeType: guessChampionData[0].rangeType,
                    sameRangeType: guessChampionData[0].rangeType === correctChampionData[0].rangeType ? "true" : "false",
                    
                    region: guessChampionData[0].region,
                    sameRegion: guessChampionData[0].region === correctChampionData[0].region ? "true" : "false",
                    
                    guessedYear: guessChampionData[0].released,
                    releaseYear: correctChampionData[0].released === guessChampionData[0].released ? "=" : correctChampionData[0].released > guessChampionData[0].released ? ">" : "<",
                    
                    genre: guessChampionData[0].genre,
                    sameGenre: guessChampionData[0].genre === correctChampionData[0].genre ? "true" : "false",
                }

                return res.json({status: "error", correctGuess: false, properties: data})
            })
        }
    })
} 

module.exports = {
    Create,
    AddMoreData,
    Guess
}
