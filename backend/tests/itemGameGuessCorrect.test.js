const app = require("../app");
const request = require("supertest");
const userModel = require("../models/userModelTest");
const itemModel = require("../models/itemModel");

describe("Testing guessing item correctly and prestige", () => {
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

  it("Guessing item correctly.", (done) => {
    itemModel.getAllIds((err, items) => {
      const idList = [];
      items.forEach((item) => {
        idList.push(item.itemId);
      });
      const guessId = idList.shift();
      const guessedIds = idList.join(",");

      itemModel.getNameById(guessId, (err, result) => {
        const guess = result[0].name;

        userModel.updateItem(
          {
            currentItemId: guessId,
            solvedItemIds: guessedIds,
            token: token,
          },
          (err, result) => {
            const body = {
              guess: guess,
            };

            request(app)
              .post("/api/item")
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
