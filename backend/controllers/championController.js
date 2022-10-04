const champion = require("../models/championModel")

const create = (req, res) => {

    const data = req.body;

    if(!data.name || !data.title || !data.resource || !data.skinCount || !data.spriteIds || !data.genre){
        return res.json({ status:"error", message:"One or more fields must be provided"})
    }

    champion.add(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }

        res.json({status: "success", message: result})
    })
}

const addMoreData = (req, res) => {
    const data = req.body;

    if(!data.position || !data.gender || !data.rangeType || !data.region || !data.released){
        return res.json({ status:"error", message:"One or more fields must be provided"})
    }

    champion.add(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }

        res.json({status: "success", message: result})
    })
}

module.exports = {
    create,
    addMoreData
}
