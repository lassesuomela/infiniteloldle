const token = (req, res, next) => {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.json({
      status: "error",
      message: "No authorization header found",
    });
  }

  if (authorization.split(" ").length !== 2) {
    return res.json({
      status: "error",
      message: "Malformed authorization header",
    });
  }
  authorization = authorization.split(" ")[1];
  if (!authorization || authorization === null || authorization.length < 10) {
    return res.json({ status: "error", message: "Token is required" });
  }

  req.token = authorization;
  next();
};

module.exports = token;
