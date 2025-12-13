const app = require("../app");
const request = require("supertest");
const user = require("../models/v2/user");
const champion = require("../models/v2/champion");
const redisCache = require("../cache/cache");
const { GuessCountKeys } = require("../helpers/redisKeys");

describe("Testing champion clue functionality", () => {
  let token = "";
  let userId = 0;

  beforeAll(async () => {
    // Clear Redis before tests
    await redisCache.flush();
  });

  it("Creating user account with nickname defined.", (done) => {
    const body = {
      nickname: "clueTestUser",
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

  it("Should not return splash clue when guess count is less than 10", async () => {
    const res = await request(app)
      .get("/api/clue/champion")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.clue).toBeNull();
    expect(res.body.message).toBe("Not enough guesses to unlock clue");
  });

  it("Should not return ability clue when guess count is less than 5", async () => {
    const res = await request(app)
      .get("/api/clue/ability")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.clue).toBeNull();
    expect(res.body.message).toBe("Not enough guesses to unlock clue");
  });

  it("Should increment guess count and return it in response", async () => {
    const userObj = await user.findByToken(token);
    userId = userObj.id;
    const correctChampion = await champion.findById(userObj.currentChampion);

    // Get a different champion to guess wrongly
    const allChampions = await champion.findAllIds();
    const wrongChampion = await champion.findById(
      allChampions.find((id) => id !== correctChampion.id)
    );

    const body = {
      guess: wrongChampion.name,
    };

    const res = await request(app)
      .post("/api/guess")
      .send(body)
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.correctGuess).toBe(false);
    expect(res.body).toHaveProperty("guessCount");
    expect(res.body.guessCount).toBe(1);
  });

  it("Should still not return splash clue after 6 guesses but should return ability clue after 5", async () => {
    const userObj = await user.findByToken(token);
    const correctChampion = await champion.findById(userObj.currentChampion);
    const allChampions = await champion.findAllIds();
    const wrongChampion = await champion.findById(
      allChampions.find((id) => id !== correctChampion.id)
    );

    // Make 4 more wrong guesses (total will be 5)
    for (let i = 0; i < 4; i++) {
      await request(app)
        .post("/api/guess")
        .send({ guess: wrongChampion.name })
        .set("Authorization", "Bearer " + token);
    }

    // Check that splash clue is still not available
    const splashRes = await request(app)
      .get("/api/clue/champion")
      .set("Authorization", "Bearer " + token);

    expect(splashRes.body.status).toBe("success");
    expect(splashRes.body.clue).toBeNull();

    // Check that ability clue IS available
    const abilityRes = await request(app)
      .get("/api/clue/ability")
      .set("Authorization", "Bearer " + token);

    expect(abilityRes.body.status).toBe("success");
    expect(abilityRes.body.clue).not.toBeNull();
    expect(abilityRes.body.clue.type).toBe("ability");
    expect(abilityRes.body.clue.data).toBeDefined();
  });

  it("Should return splash art clue after 10th guess", async () => {
    const userObj = await user.findByToken(token);
    const correctChampion = await champion.findById(userObj.currentChampion);
    const allChampions = await champion.findAllIds();
    const wrongChampion = await champion.findById(
      allChampions.find((id) => id !== correctChampion.id)
    );

    // Make 5 more wrong guesses (total will be 10)
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/guess")
        .send({ guess: wrongChampion.name })
        .set("Authorization", "Bearer " + token);
    }

    // Now splash clue should be available
    const res = await request(app)
      .get("/api/clue/champion")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.clue).not.toBeNull();
    expect(res.body.clue.type).toBe("splash_art");
    expect(res.body.clue.data).toBeDefined();
    expect(typeof res.body.clue.data).toBe("string"); // base64 string
  });

  it("Should return the same clue on subsequent requests", async () => {
    const res1 = await request(app)
      .get("/api/clue/champion")
      .set("Authorization", "Bearer " + token);

    const res2 = await request(app)
      .get("/api/clue/champion")
      .set("Authorization", "Bearer " + token);

    expect(res1.body.status).toBe("success");
    expect(res2.body.status).toBe("success");
    expect(res1.body.clue.data).toBe(res2.body.clue.data);
  });

  afterAll(async () => {
    // Clean up
    await redisCache.flush();
  });
});
