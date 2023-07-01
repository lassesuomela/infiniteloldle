const app = require("../app");
const request = require("supertest");
const userModel = require("../models/userModelTest");
const championModel = require("../models/championModel");

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

  it("Guessing champion correctly.", (done) => {
    championModel.getAllIds((err, results) => {
      const idList = [];
      results.forEach((result) => {
        idList.push(result.id);
      });
      const guessId = idList.shift();
      const guessedIds = idList.join(",");

      championModel.getNameById(guessId, (err, result) => {
        const guess = result[0].name;

        userModel.update(
          {
            solvedChampions: guessedIds,
            currentChampion: guessId,
            token: token,
          },
          (err, result) => {
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
          }
        );
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
