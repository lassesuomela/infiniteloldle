const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

router.get("/user", userController.CheckToken);

router.put("/user/nickname", userController.ChangeNickname);
router.put("/user/country", userController.ChangeCountry);
router.put("/user/champion", userController.ChangeChampionGuess);
router.put("/user/splash", userController.ChangeSplashGuess);
router.put("/user/item", userController.ChangeItemGuess);
router.put("/user/oldItem", userController.ChangeOldItemGuess);
router.put("/user/ability", userController.ChangeAbilityGuess);

router.delete("/user", userController.DeleteUser);

module.exports = router;
