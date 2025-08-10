const express = require("express");

const router = express.Router();

const championController = require("../controllers/championController");
const itemController = require("../controllers/itemController");
const oldItemController = require("../controllers/oldItemController");

router.post("/guess", championController.Guess);
router.post("/splash", championController.GuessSplash);

router.post("/item", itemController.GuessItem);
router.get("/item", itemController.GetItemSprite);

router.post("/oldItem", oldItemController.GuessItem);
router.get("/oldItem", oldItemController.GetItemSprite);

router.get("/splash", championController.GetSplashArt);

router.post("/ability", championController.GuessAbility);

module.exports = router;
