const champion = require("../models/championModel")
const user = require("../models/userModel")

const Create = (req, res) => {

    const data = req.body;

    if(!data.name || !data.title || !data.resource || !data.skinCount || !data.spriteIds || !data.genre || !data.gender){
        return res.json({ status:"error", message: "One or more fields must be provided"})
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

    if(!body.champion || !body.data[0].released || !body.data[1].region || !body.data[2].positions || !body.data[3].rangeTypes){
        return res.json({status: "error", message: "One or more fields must be provided"})
    }

    champion.addMoreData(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }
        res.json({status: "success", message: "Champion edited"})
    })
}

const AddChampionId = (req, res) => {
    const body = req.body;

    const data = {
        name: body.name,
        key: body.key
    }

    if(!body.name || !body.key){
        return res.json({status: "error", message: "One or more fields must be provided"})
    }

    console.log(data.key, data.name);

    champion.addChampionId(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }
        res.json({status: "success", message: "Champion edited"})
    })
}

const GetAllChampions = (req, res) => {

    champion.getAllNames((err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }

        let champions = [];
        result.forEach(champ => {
            champions.push({label:champ["name"], value:champ["name"]})    
        });

        res.json({status: "success", champions: champions})
    })
}


const Guess = (req, res) => {

    const { guess } = req.body;

    if (!guess) {
        return res.json({status: "error", message: "Guess is required"});
    }

    const token = req.token;

    champion.getByToken(token, (err, correctChampionData) => {

        if(!correctChampionData[0]){
            return res.json({status: "error", message: "Token is invalid"})
        }

        // wrong guess return diff

        champion.getByName(guess, (err, guessChampionData) => {

            if (!guessChampionData[0]){
                return res.json({ status: "error", message: "Nothing found with that champion name"})
            }

            const champData = {
                guessedChampion: guessChampionData[0].name,
                championKey: guessChampionData[0].championKey,
                
                resource: guessChampionData[0].resource,

                gender: guessChampionData[0].gender,
                
                position: guessChampionData[0].position,
                
                rangeType: guessChampionData[0].rangeType,
                
                region: guessChampionData[0].region,
                
                releaseYear: guessChampionData[0].released,
                
                genre: guessChampionData[0].genre,
            }

            // Todo:
            // fix this, it doesnt actually work
            let samePos;
            console.log(guessChampionData[0].position + "===" + correctChampionData[0].position)
            if(guessChampionData[0].position === correctChampionData[0].position){
                samePos = true;
            }else if(guessChampionData[0].position.includes(correctChampionData[0].position)){
                samePos = "partial";
            }else{
                samePos = false;
            }

            const similarites = {
                sameResource: guessChampionData[0].resource === correctChampionData[0].resource ? true : false,
                sameGender: guessChampionData[0].gender === correctChampionData[0].gender ? true : false,
                sameReleaseYear: correctChampionData[0].released === guessChampionData[0].released ? "=" : correctChampionData[0].released > guessChampionData[0].released ? ">" : "<",
                
                samePosition: samePos,

                // TODO: get partial data
                sameRangeType: guessChampionData[0].rangeType === correctChampionData[0].rangeType ? true : false,
                
                // TODO: get partial data
                sameRegion: guessChampionData[0].region === correctChampionData[0].region ? true : false,
                
                // TODO: get partial data
                sameGenre: guessChampionData[0].genre === correctChampionData[0].genre ? true : false,
            }

            if(guess !== correctChampionData[0].name){
                return res.json({status: "error", correctGuess: false, properties: [champData, similarites]})

            }else{
                champion.getAllIds((err, data) => {
                    if(err) {
                        console.log(err);
                        return res.json({status: "error", message: "Error on fetching champions ids"})
                    }
    
                    user.fetchByToken(token, (err, result) => {
    
                        if(err) {
                            console.log(err);
                            return res.json({status: "error", message: "Error on fetching data with the token provided"})
                        }
    
                        let solvedChampions;
    
                        if(result[0]["solvedChampion"]){
                            solvedChampions = correctChampionData[0]["id"] + "," + result[0]["solvedChampion"];
                        }else{
                            solvedChampions = correctChampionData[0]["id"];
                        }
    
                        let solvedChamps;
                        if(solvedChampions.length > 1){
                            solvedChamps = solvedChampions.split(",");
                        }else {
                            solvedChamps = solvedChampions.toString();
                        }
    
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
                                return res.json({status: "error", message: "Error on updating user data"})
                            }
            
                            res.json({status: "success", correctGuess: true, properties: [champData, similarites]})
                        })
                    })
                })
            }
        })
    })
} 

module.exports = {
    Create,
    AddMoreData,
    AddChampionId,
    GetAllChampions,
    Guess
}
