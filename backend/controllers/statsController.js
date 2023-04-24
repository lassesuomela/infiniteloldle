const statsModel = require("../models/statsModel");
const cache = require("../middleware/cache");

const GetAll = (req, res) => {
  const key = req.path;
  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
    res.set("X-CACHE-REMAINING", new Date(cache.getTtl(key)).toISOString());
    return res.json(cache.getCache(key));
  }

  statsModel.getAll((err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: "error", error: "No statistics data found" });
    }
    if (!result) {
      return res.status(500).json({
        status: "error",
        error: "No statistics data found",
      });
    }

    let globalSkinCount = 0;

    result[5].forEach((champion) => {
      globalSkinCount += champion.skinCount;
    });

    const response = {
      status: "success",
      stats: result[0],
      register_count: result[1][0].user_count,
      player_count: result[2][0].player_count,
      item_count: result[3][0].item_count,
      champion_count: result[4][0].champion_count,
      global_skin_count: globalSkinCount,
      player_stats: result[6],
      todays_players: result[7],
      todays_player_count: result[7].length,
    };

    cache.saveCache(key, response);
    cache.changeTTL(key, 3600);

    res.json(response);
  });
};

module.exports = {
  GetAll,
};
