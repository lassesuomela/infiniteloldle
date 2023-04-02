const scoreboard = require("../models/scoreboardModel");
const cache = require("../middleware/cache");

const TopAllTime = (req, res) => {
  if (cache.checkCache(req.path)) {
    res.set("X-CACHE", "HIT");
    return res.json(cache.getCache(req.path));
  }

  scoreboard.getByScoreCount((err, result) => {
    if (!result || result.length === 0) {
      return res.json({
        status: "error",
        error: "No results found",
        scores: [],
      });
    }

    const response = {
      status: "success",
      scores: result[0],
      playerCount: result[1][0]["playerCount"],
    };

    cache.saveCache(req.path, response);
    cache.changeTTL(req.path, 120);

    res.json(response);
  });
};

module.exports = {
  TopAllTime,
};
