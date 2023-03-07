const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")
const itemController = require("../controllers/itemController")

router.post('/guess', championController.Guess)
router.post('/splash', championController.GuessSplash)
router.post('/item', itemController.GuessItem)
router.get('/item', itemController.GetItemSprite)
router.get('/splash', championController.GetSplashArt)

module.exports = router;
