const express = require('express');

const router = express.Router();

const userController = require("../controllers/userController")

router.get("/user", userController.CheckToken)

router.put("/user/nickname", userController.ChangeNickname)

module.exports = router;
