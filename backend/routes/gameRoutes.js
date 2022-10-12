const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/guess', championController.Guess)
router.get('/champions', championController.GetAllChampions)

module.exports = router;
