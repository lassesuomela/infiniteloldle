const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/champion', championController.create)

module.exports = router;
