const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/guess', championController.Guess)
router.post('/splash', championController.GuessSplash)
router.get('/splash', championController.GetSplashArt)

module.exports = router;
