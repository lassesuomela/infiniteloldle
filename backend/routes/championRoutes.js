const express = require('express');

const router = express.Router();

const championController = require("../controllers/championController")

router.post('/champion', championController.Create)
router.put('/champion', championController.AddMoreData)

module.exports = router;
