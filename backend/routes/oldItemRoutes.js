const express = require("express");

const router = express.Router();

const oldItemController = require("../controllers/oldItemController");

router.post("/oldItem", oldItemController.Create);

module.exports = router;
