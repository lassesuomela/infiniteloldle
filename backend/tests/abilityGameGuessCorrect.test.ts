const app = require("../app");
const request = require("supertest");
const user = require("../models/v2/user");
const ability = require("../models/v2/ability");

describe("Testing guessing abilities correctly and prestige", () => {
  let token = "";

  it("Creating user account with nickname defined.", async () => {
    const body = { nickname: "jestuser_ability" };

    const res = await request(app).post("/api/user").send(body);

    expect(res.body.status).toBe("success");
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  let score = 0;
  let prestige = 0;

  it("Get user data", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + token);

    expect(res.body.message).toBe("Token is valid");
    score = res.body.player.score;
    prestige = res.body.player.prestige;
  });

  it("Guessing ability correctly and triggering prestige reset", async () => {
    // Get all ability IDs
    const abilityIds = await ability.findAllIds();

    // Pick one ability to guess, mark the rest as solved
    const guessId = abilityIds.shift();
    const solvedIds = abilityIds;

    const abilityData = await ability.findById(guessId, {
      include: { champion: true },
    });
    const guess = abilityData.champion.name;

    // Get user object
    const userObj = await user.findByToken(token);

    // Mark all other abilities as solved

    await user.addSolvedAbilities(
      solvedIds.map((abilityId) => ({
        userId: userObj.id,
        abilityId,
      }))
    );

    // Set current ability to the one we're going to guess
    await user.updateById(userObj.id, { currentAbilityId: guessId });

    // Make sure we actually have solved abilities
    const solvedBefore = await user.getSolvedAbilityIds(userObj.id);
    expect(solvedBefore).not.toHaveLength(0);

    // Perform the guess
    const res = await request(app)
      .post("/api/ability")
      .send({ guess })
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.correctGuess).toBe(true);
    expect(res.body.abilityName).toBe(abilityData.name);
    expect(res.body.name).toBe(abilityData.champion.name);

    // After prestige reset, solved list should be empty
    const solvedAfter = await user.getSolvedAbilityIds(userObj.id);
    expect(solvedAfter).toHaveLength(0);
  });

  it("Get user data after guessing correctly", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + token);

    expect(res.body.message).toBe("Token is valid");
    expect(res.body.player.score).toBeGreaterThan(score);
    expect(res.body.player.prestige).toBeGreaterThan(prestige);
  });
});
