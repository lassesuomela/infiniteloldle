const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/guess', championController.Guess)

module.exports = router;
