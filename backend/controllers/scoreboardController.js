const scoreboard = require("../models/scoreboardModel");
const cache = require("../middleware/cache");

const TopAllTime = (req, res) => {
  const key = req.path;
  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    res.set("X-CACHE-REMAINING", cache.getTtl(key));
    return res.json(cache.getCache(key));
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

    cache.saveCache(key, response);
    cache.changeTTL(key, 120);

    res.json(response);
  });
};

module.exports = {
  TopAllTime,
};
