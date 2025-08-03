require("dotenv").config();
const Parser = require("ua-parser-js");

const checkRequest = (req, res, next) => {
  if (process.env.NODE_ENV === "dev") {
    next();
    return;
  }
  const ua = req.get("User-Agent");
  if (ua === undefined || ua === "-") {
    return res.status(444);
  }
  if (ua.includes("wget") || ua.includes("curl") || ua.includes("python")) {
    return res.status(444);
  }
  const parsedUA = new Parser(ua).getResult();
  if (parsedUA.browser.name === undefined) {
    return res.status(444);
  }
  next();
};

module.exports = { checkRequest };
