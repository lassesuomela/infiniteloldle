const app = require("../app");
const request = require("supertest");
const item = require("../models/v2/item");
const user = require("../models/v2/user");

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

  it("Guessing item correctly.", async () => {
    // Get all item IDs
    const items = await item.findAllItemIds();

    const idList = items;
    const guessId = idList.shift();
    const guessedIds = idList;

    // Get item name by id
    const result = await item.findByItemId(guessId);
    const guess = result.name;

    // Get user from token using the new user model
    const userObj = await user.findByToken(token);

    await user.addSolvedItems(
      guessedIds.map((itemId) => ({
        userId: userObj.id,
        itemId,
      }))
    );

    // Set currentItemId to the missing one using the new user model
    await user.updateById(userObj.id, { currentItemId: guessId });

    const body = { guess };

    const res = await request(app)
      .post("/api/item")
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

