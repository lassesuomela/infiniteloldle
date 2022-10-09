require("dotenv").config()

const auth = (req, res, next) => {
    const token = req.token;

    if(token === process.env.TOKEN) {
        next();
    }else{
        res.json({status:"error", message: "Invalid authorization token"})
    }
}

module.exports = auth