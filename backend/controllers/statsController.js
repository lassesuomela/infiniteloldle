const statsModel = require("../models/statsModel");

const GetAll = (req, res) => {
  statsModel.getAll((err, result) => {
    if(err) {
      console.log(err);
      return res.status(500).json({status:"error", msg:"No statistics data found"})
    }
    if (result[0].length === 0) {
      return res.json({
        status: "error",
        error: "No results found",
      });
    }

    let globalSkinCount = 0;

    result[5].forEach(champion => {
      globalSkinCount += champion.skinCount;
    })

    const response = {
      status: "success",
      stats: result[0],
      register_count: result[1][0].user_count,
      player_count: result[2][0].player_count,
      item_count: result[3][0].item_count,
      champion_count: result[4][0].champion_count,
      global_skin_count: globalSkinCount,
      player_stats: result[6]
    };

    res.json(response);
  });
};

module.exports = {
  GetAll,
};
