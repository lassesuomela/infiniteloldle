const scoreboard = require("../models/scoreboardModel");
const cache = require("../middleware/cache");

const TopAllTime = async (req, res) => {
  const key = req.path;
  if (await cache.checkCache(key)) {
    return res.json(await cache.getCache(key));
  }

  scoreboard.getByScoreCount(async (err, result) => {
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

    await cache.saveCache(key, response);
    await cache.changeTTL(key, 300);

    res.json(response);
  });
};

module.exports = {
  TopAllTime,
};
