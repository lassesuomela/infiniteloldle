const express = require('express');

const router = express.Router();

const scoreboardController = require("../controllers/scoreboardController")

router.get("/scoreboard", scoreboardController.TopAllTime)

module.exports = router;
