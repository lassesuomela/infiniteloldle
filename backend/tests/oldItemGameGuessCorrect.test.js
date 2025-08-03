const app = require("../app");
const request = require("supertest");
const oldItem = require("../models/v2/oldItem");
const user = require("../models/v2/user");

describe("Testing guessing legacy item correctly and prestige", () => {
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

  it("Guessing legacy item correctly.", async () => {
    // Get all old item IDs
    const items = await oldItem.findAllIds();
    const idList = items;
    const guessId = idList.shift();
    const guessedIds = idList;

    // Get item name by id
    const result = await oldItem.findById(guessId);
    const guess = result.name;

    // Get user from token using the new user model
    const userObj = await user.findByToken(token);

    // Insert solved old items into the join table using the new user model
    for (const itemId of guessedIds) {
      await user.addSolvedOldItem(userObj.id, itemId);
    }

    // Set currentOldItemId to the missing one using the new user model
    await user.updateById(userObj.id, { currentOldItemId: guessId });

    const body = { guess };

    const res = await request(app)
      .post("/api/oldItem")
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
