const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/champion', championController.Create)
router.put('/champion/id', championController.AddChampionId)
router.put('/champion', championController.AddMoreData)
router.get('/champion/keys', championController.GetAllChampionKeys)

module.exports = router;
