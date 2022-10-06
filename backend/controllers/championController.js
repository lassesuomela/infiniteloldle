const champion = require("../models/championModel")

const create = (req, res) => {

    const data = req.body;

    if(!data.name || !data.title || !data.resource || !data.skinCount || !data.spriteIds || !data.genre){
        return res.json({ status:"error", message:"One or more fields must be provided"})
    }

    champion.create(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }

        res.json({status: "success", message: "Champion added successfully"})
    })
}

const addMoreData = (req, res) => {
    const body = req.body;

    const data = {
        name:body.champion,
        released: body.data[0].released.toString(),
        position: body.data[1].positions.toString(),
        rangeType: body.data[2].rangeTypes.toString()
    }

    if(!data.position || !data.rangeType || !data.released || !data.name){
        return res.json({ status:"error", message:"One or more fields must be provided"})
    }

    champion.addMoreData(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }
        res.json({status: "success", message: "Champion edited"})
    })
}

module.exports = {
    create,
    addMoreData
}
