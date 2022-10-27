const token = (req, res, next) => {
    let authorization = req.headers.authorization

    if(!authorization){
        console.log(req.headers);
        console.log(req.body);
        return res.json({status:"error", message: "Token is required"})
    }

    authorization = authorization.split(" ")[1]

    req.token = authorization;

    next();
}

module.exports = token
