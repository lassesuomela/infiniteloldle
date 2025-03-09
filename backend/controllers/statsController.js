const statsModel = require("../models/statsModel");
const cache = require("../middleware/cache");

const GetAll = (req, res) => {
  const key = req.path;

  if (cache.checkCache(key)) {
    res.set("X-CACHE", "HIT");
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

    let countries = [];

    result[8].forEach((data) => {
      if (data.Country !== null) {
        countries.push(data);
      }
    });

    let mau = 0;
    result[0].forEach((count) => {
      mau += count["dau"];
    });

    // delete 0 scores
    result[13].shift();

    // calculate delta of users and players past 30 days
    const userDelta = [];
    result[10].reverse();
    result[10].sort((a, b) => {
      const userGain = a.users - b.users;
      const playerGain = a.players - b.players;
      const date = a.date;
      userDelta.push({ users: userGain, players: playerGain, date: date });
    });

    const response = {
      status: "success",
      stats: result[0],
      register_count: result[1][0].user_count,
      player_count: result[2][0].player_count,
      item_count: result[3][0].item_count,
      champion_count: result[4][0].champion_count,
      global_skin_count: globalSkinCount,
      player_stats: result[6].reverse(),
      todays_players: result[7].reverse(),
      todays_player_count: result[9][0].count,
      yesterdays_player_count: result[12][0].count,
      top_countries: countries,
      user_data: userDelta,
      dau: result[0][0].dau,
      mau: mau,
      old_item_count: result[11][0].old_item_count,
      score_count_graph: result[13],
    };

    cache.saveCache(key, response);
    cache.changeTTL(key, 30);
    res.set("X-CACHE", "MISS");

    res.json(response);
  });
};

module.exports = {
  GetAll,
};
