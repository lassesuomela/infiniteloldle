const app = require("../app");
const request = require("supertest");
const user = require("../models/v2/user");
const champion = require("../models/v2/champion");
const redisCache = require("../cache/cache");
const { GuessCountKeys } = require("../helpers/redisKeys");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

describe("Testing guess count functionality", () => {
  let token = "";
  let userId = 0;

  beforeAll(async () => {
    // Clear Redis before tests
    await redisCache.flush();
  });

  it("Creating user account with nickname defined.", (done) => {
    const body = {
      nickname: "guessCountTestUser",
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

  it("Increment guess count on wrong champion guess", async () => {
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

    // Check Redis guess count
    const guessCountKey = GuessCountKeys.champion(userId);
    const count = await redisCache.getGuessCount(guessCountKey);
    expect(count).toBe(1);
  });

  it("Increment guess count multiple times", async () => {
    const userObj = await user.findByToken(token);
    const correctChampion = await champion.findById(userObj.currentChampion);

    // Get a different champion
    const allChampions = await champion.findAllIds();
    const wrongChampion = await champion.findById(
      allChampions.find((id) => id !== correctChampion.id)
    );

    // Make another wrong guess
    const body = {
      guess: wrongChampion.name,
    };

    await request(app)
      .post("/api/guess")
      .send(body)
      .set("Authorization", "Bearer " + token);

    // Check Redis guess count
    const guessCountKey = GuessCountKeys.champion(userId);
    const count = await redisCache.getGuessCount(guessCountKey);
    expect(count).toBe(2);
  });

  it("Save guess count to database on correct guess", async () => {
    const userObj = await user.findByToken(token);
    const correctChampion = await champion.findById(userObj.currentChampion);

    const body = {
      guess: correctChampion.name,
    };

    const res = await request(app)
      .post("/api/guess")
      .send(body)
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.correctGuess).toBe(true);

    // Check that guess count is cleared from Redis
    const guessCountKey = GuessCountKeys.champion(userId);
    const redisCount = await redisCache.getGuessCount(guessCountKey);
    expect(redisCount).toBe(0);

    // Check that guess count is saved to database
    const solvedChampion = await prisma.userSolvedChampions.findFirst({
      where: {
        userId: userId,
        championId: correctChampion.id,
      },
    });

    expect(solvedChampion).not.toBeNull();
    expect(solvedChampion.guessCount).toBe(3); // 2 wrong + 1 correct
  });

  it("Reset guess count on reroll", async () => {
    const userObj = await user.findByToken(token);

    // Make a wrong guess first
    const correctChampion = await champion.findById(userObj.currentChampion);
    const allChampions = await champion.findAllIds();
    const wrongChampion = await champion.findById(
      allChampions.find((id) => id !== correctChampion.id)
    );

    await request(app)
      .post("/api/guess")
      .send({ guess: wrongChampion.name })
      .set("Authorization", "Bearer " + token);

    // Check guess count increased
    let guessCountKey = GuessCountKeys.champion(userId);
    let count = await redisCache.getGuessCount(guessCountKey);
    expect(count).toBeGreaterThan(0);

    // Reroll
    const b = await request(app)
      .put("/api/user/champion")
      .set("Authorization", "Bearer " + token);

    expect(b.body.status).toBe("success");
    expect(b.body.message).toBe("Changed guess to champion game");
    // Check guess count is reset
    count = await redisCache.getGuessCount(guessCountKey);
    expect(count).toBe(0);
  });

  afterAll(async () => {
    // Clean up
    await redisCache.flush();
    await prisma.$disconnect();
  });
});

