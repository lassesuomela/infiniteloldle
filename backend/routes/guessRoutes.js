const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/guess', championController.Guess)
router.post('/splash', championController.GuessSplash)

module.exports = router;
