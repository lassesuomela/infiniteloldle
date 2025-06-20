const app = require("../app");
const request = require("supertest");
const championModel = require("../models/championModel");
const user = require("../models/v2/user");
const champion = require("../models/v2/champion");

describe("Testing guessing champs correctly and prestige", () => {
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

  it("Guessing champion correctly.", async () => {
    const championIds = await champion.findAllIds();

    const guessId = championIds.shift();
    const guessedIds = championIds;

    const championData = await champion.findById(guessId);
    const guess = championData.name;

    const userObj = await user.findByToken(token);

    for (const champId of guessedIds) {
      await user.addSolvedChampion(userObj.id, champId);
    }

    await user.updateById(userObj.id, { currentChampion: guessId });

    const body = {
      guess: guess,
    };

    const res = await request(app)
      .post("/api/guess")
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
