/**
 * Middleware to parse the real IP address of the user when behind Cloudflare.
 * Attaches the real from headers "cf-connecting-ip" that nginx attaches as x-real-ip
 * Bind the IP to req.ip.
 */
const ipParser = (req, res, next) => {
  const cloudflareIp =
    req.headers["X-Real-IP"] || req.headers["cf-connecting-ip"];
  if (cloudflareIp) {
    req.ip = cloudflareIp;
  }
  next();
};

module.exports = ipParser;
