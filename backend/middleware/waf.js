const Parser = require("ua-parser-js");

const checkRequest = (req, res, next) => {
  const ua = req.get("User-Agent");
  if (ua.includes("wget") || ua.includes("curl") || ua.includes("python")) {
    console.log("Bad request UA. Closing connection." + ua);
    return res.status(444);
  }
  const parsedUA = new Parser(ua).getResult();
  if (parsedUA.browser.name === undefined || parsedUA.os.name === undefined) {
    console.log("Bad request UA. Closing connection." + ua);
    return res.status(444);
  }
  next();
};

module.exports = { checkRequest };
