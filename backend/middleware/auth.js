require("dotenv").config()

const auth = (req, res, next) => {
    const token = req.token;

    if(process.env.NODE_ENV !== "dev"){
        return res.json({status:"error", message: "This is disabled in production mode"});
    }

    if(token === process.env.TOKEN) {
        next();
    }else{
        res.json({status:"error", message: "Invalid authorization token"})
    }
}

module.exports = auth