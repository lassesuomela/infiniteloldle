const ips = [];
const stats = {};

const track = (req, res, next) => {
  const host = req.ip;
  const method = req.method;

  if (stats["dau"] === undefined) {
    stats["dau"] = 0;
  }
  if (stats[method] === undefined) {
    stats[method] = 0;
  }

  if (ips.indexOf(host) === -1) {
    stats["dau"] += 1;
    ips.push(host);
  }

  stats[method] += 1;

  console.log(stats);

  next();
};

module.exports = track;
