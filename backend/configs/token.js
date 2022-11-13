const token = (req, res, next) => {
    let authorization = req.headers.authorization

    if(!authorization){
        return res.json({status:"error", message: "Token is required"})
    }

    authorization = authorization.split(" ")[1]

    req.token = authorization;

    next();
}

module.exports = token
