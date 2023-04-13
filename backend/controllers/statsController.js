const statsModel = require("../models/statsModel");

const GetAll = (req, res) => {
  statsModel.getAll((err, result) => {
    if (!result || result.length === 0) {
      return res.json({
        status: "error",
        error: "No results found",
      });
    }

    const response = {
      status: "success",
      stats: result,
    };

    res.json(response);
  });
};

module.exports = {
  GetAll,
};
