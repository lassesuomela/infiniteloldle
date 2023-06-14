const scoreboard = require("../models/scoreboardModel");
const cache = require("../middleware/cache");

const TopAllTime = (req, res) => {
  const key = req.path;
  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    res.set("X-CACHE-REMAINING", new Date(cache.getTtl(key)).toISOString());
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
      registered_count: result[1][0]["registered_count"],
      player_count: result[2][0]["player_count"],
    };

    cache.saveCache(key, response);
    cache.changeTTL(key, 300);

    res.json(response);
  });
};

module.exports = {
  TopAllTime,
};
