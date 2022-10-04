require("dotenv").config()

const auth = (req, res, next) => {
    let authorization = req.headers.authorization

    if(!authorization){
        return res.json({status:"error", message: "Authorization token required"})
    }

    authorization = authorization.split(" ")[1]

    if(authorization === process.env.TOKEN) {
        next();
    }else{
        res.json({status:"error", message: "Invalid authorization token"})
        console.log(authorization);
    }
}

module.exports = auth