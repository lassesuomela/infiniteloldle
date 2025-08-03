const app = require("../app");
const request = require("supertest");
const userModel = require("../models/v2/user");
const championModel = require("../models/v2/champion");
const skin = require("../models/v2/skin");

describe("Testing guessing splash correctly and prestige", () => {
  let token = "";
  it("Creating user account with nickname defined.", (done) => {
    const body = {
      nickname: "jestuser",
    };

    request(app)
      .post("/api/user")
      .send(body)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("token");

        token = res.body.token;

        done();
      });
  });

  let score,
    prestige = 0;

  it("Get user data", (done) => {
    request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + token)
      .then((res) => {
        expect(res.body.message).toBe("Token is valid");
        score = res.body.player.score;
        prestige = res.body.player.prestige;
        done();
      });
  });

  it("Guessing splash correctly.", async () => {
    // Get all champion IDs
    const championIds = await championModel.findAllIds();

    // The one to guess
    const guessId = championIds.shift();
    const guessedIds = championIds;

    // Get champion name by id
    const championData = await championModel.findById(guessId);
    const guess = championData.name;

    // Get user from token using the new user model
    const userObj = await userModel.findByToken(token);

    // Insert solved splashes into the join table using the new user model
    for (const champId of guessedIds) {
      await userModel.addSolvedSplash(userObj.id, champId);
    }

    const skins = await skin.findByChampionId(guessId);
    const skinToGuess = skins[0];

    // Set currentSplashChampion to the missing one using the new user model
    await userModel.updateById(userObj.id, {
      currentSplashSkinId: skinToGuess.id,
    });

    const body = { guess };

    const res = await request(app)
      .post("/api/splash")
      .send(body)
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.correctGuess).toBe(true);
  });

  it("Get user data after guessing correctly", (done) => {
    request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + token)
      .then((res) => {
        expect(res.body.message).toBe("Token is valid");
        expect(res.body.player.score).toBeGreaterThan(score);
        expect(res.body.player.prestige).toBeGreaterThan(prestige);
        done();
      });
  });
});
