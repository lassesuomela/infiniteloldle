const express = require("express");

const router = express.Router();

const itemController = require("../controllers/itemController")

router.post("/item", itemController.Create)

module.exports = router;
