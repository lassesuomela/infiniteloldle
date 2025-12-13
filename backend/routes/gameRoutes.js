const express = require("express");

const router = express.Router();

const championController = require("../controllers/championController");
const itemController = require("../controllers/itemController");
const oldItemController = require("../controllers/oldItemController");

router.get("/champions", championController.GetAllChampions);
router.get("/items", itemController.GetAllItems);
router.get("/oldItems", oldItemController.GetAllItems);
router.get("/config", championController.GetClueConfig);

module.exports = router;
