const champion = require("../models/championModel")

const create = (req, res) => {
    const data = req.body;

    champion.add(data, (err, result) => {
        if(err){
            return res.json({status: "error", error: err})
        }

        res.json({status: "success", message: result})
    })
}

module.exports = {
    create
}
