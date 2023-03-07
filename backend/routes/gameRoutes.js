
const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")
const itemController = require("../controllers/itemController")

router.get('/champions', championController.GetAllChampions)
router.get('/items', itemController.GetAllItems)

module.exports = router;
