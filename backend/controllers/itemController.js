const item = require("../models/itemModel")

const Create = (req, res) => {

    const data = req.body;

    if(!data.name || !data.id){
        return res.json({status:"error", message: "One or more fields must be provided"})
    }

    item.create(data, (err, result) => {

        if(err){
            return res.json({status: "error", error: err})
        }

        res.json({status: "success", message: "Item added successfully"})
    })
}

module.exports = {
    Create
}
