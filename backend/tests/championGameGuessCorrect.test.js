const app = require("../app");
const request = require("supertest");
const userModel = require("../models/userModelTest");
const championModel = require("../models/championModel");
const { user } = require("../models/v2/user");

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

  it("Guessing champion correctly.", async (done) => {
    championModel.getAllIds(async (err, results) => {
      const idList = [];
      results.forEach((result) => {
        idList.push(result.id);
      });
      const guessId = idList.shift();
      const guessedIds = idList;

      championModel.getNameById(guessId, async (err, result) => {
        const guess = result[0].name;

        // Get user from token using the new user model
        const userObj = await user.findByToken(token);

        // Insert solved champions into the join table using the new user model
        for (const champId of guessedIds) {
          await user.addSolvedChampion(userObj.id, champId);
        }

        // Set currentChampion to the missing one using the new user model
        await user.updateById(userObj.id, { currentChampion: guessId });

        const body = {
          guess: guess,
        };

        request(app)
          .post("/api/guess")
          .send(body)
          .set("Authorization", "Bearer " + token)
          .then((res) => {
            expect(res.body.status).toBe("success");
            expect(res.body.correctGuess).toBe(true);

            done();
          });
      });
    });
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
