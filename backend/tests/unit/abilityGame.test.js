// __tests__/abilityRoutes.test.js
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

// Mocks
jest.mock("../../models/v2/user");
jest.mock("../../models/v2/ability");
jest.mock("../../models/v2/champion");
jest.mock("../../middleware/cache");
jest.mock("fs/promises", () => ({ readFile: jest.fn() }));
jest.mock("path", () => ({
  ...jest.requireActual("path"),
  join: jest.fn(() => "/mock/path/to/file.webp"),
}));
const userV2 = require("../../models/v2/user");
const ability = require("../../models/v2/ability");
const championV2 = require("../../models/v2/champion");
const cache = require("../../middleware/cache");

const fsp = require("fs/promises");
const path = require("path");

const {
  GuessAbility,
  GetAbilitySprite,
} = require("../../controllers/championController");

const app = express();
app.use(bodyParser.json());
app.post("/guess-ability", (req, res, next) => {
  req.token = req.headers["authorization"] || null;
  GuessAbility(req, res, next);
});
app.get("/ability-sprite", (req, res, next) => {
  req.token = req.headers["authorization"] || null;
  GetAbilitySprite(req, res, next);
});

describe("GuessAbility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if guess is missing", async () => {
    const res = await request(app)
      .post("/guess-ability")
      .set("Authorization", "token123")
      .send({});
    expect(res.body).toEqual({ status: "error", message: "Guess is required" });
  });

  it("should return error if token is invalid", async () => {
    userV2.findByToken.mockResolvedValue(null);
    const res = await request(app)
      .post("/guess-ability")
      .set("Authorization", "token123")
      .send({ guess: "Ahri" });
    expect(res.body).toEqual({ status: "error", message: "Token is invalid" });
  });

  it("should return error if champion not found", async () => {
    userV2.findByToken.mockResolvedValue({ currentAbilityId: 1 });
    ability.findById.mockResolvedValue({
      id: 1,
      name: "Orb of Deception",
      champion: { name: "Ahri", championKey: "Ahri" },
    });
    championV2.findByName.mockResolvedValue(null);

    const res = await request(app)
      .post("/guess-ability")
      .set("Authorization", "token123")
      .send({ guess: "WrongName" });

    expect(res.body).toEqual({
      status: "error",
      message: "Nothing found with that champion name",
    });
  });

  it("should handle wrong guess", async () => {
    userV2.findByToken.mockResolvedValue({ currentAbilityId: 1 });
    ability.findById.mockResolvedValue({
      id: 1,
      name: "Orb of Deception",
      champion: { name: "Ahri", championKey: "Ahri" },
    });
    championV2.findByName.mockResolvedValue({
      name: "Ashe",
      championKey: "Ashe",
    });

    const res = await request(app)
      .post("/guess-ability")
      .set("Authorization", "token123")
      .send({ guess: "Ashe" });

    expect(res.body).toEqual({
      status: "success",
      correctGuess: false,
      name: "Ashe",
      championKey: "Ashe",
    });
  });

  it("should handle correct guess and prestige logic", async () => {
    const userObj = { id: 1, prestige: 0, currentAbilityId: 1 };
    userV2.findByToken.mockResolvedValue(userObj);
    ability.findById.mockResolvedValue({
      id: 1,
      name: "Orb of Deception",
      champion: { name: "Ahri", championKey: "Ahri" },
    });
    championV2.findByName.mockResolvedValue({
      name: "Ahri",
      championKey: "Ahri",
    });
    ability.findAllIds.mockResolvedValue([1, 2, 3]);
    userV2.getSolvedAbilityIds.mockResolvedValue([]);
    userV2.addSolvedAbility.mockResolvedValue();
    userV2.clearSolvedAbilities.mockResolvedValue();
    userV2.updateById.mockResolvedValue();
    cache.deleteCache.mockResolvedValue();

    const res = await request(app)
      .post("/guess-ability")
      .set("Authorization", "token123")
      .send({ guess: "Ahri" });

    expect(res.body).toMatchObject({
      status: "success",
      correctGuess: true,
      abilityName: "Orb of Deception",
      name: "Ahri",
      championKey: "Ahri",
    });
    expect(userV2.addSolvedAbility).toHaveBeenCalledWith(1, 1, 1);
  });
});

describe("GetAbilitySprite", () => {
  it("should return error if token is invalid", async () => {
    userV2.findByToken.mockResolvedValue(null);

    const res = await request(app)
      .get("/ability-sprite")
      .set("Authorization", "token123");

    expect(res.body).toEqual({ status: "error", message: "Token is invalid" });
  });

  it("should return from cache if exists", async () => {
    userV2.findByToken.mockResolvedValue({ currentAbilityId: 1 });
    ability.findById.mockResolvedValue({
      champion: { championKey: "Ahri" },
      key: "Q",
    });
    cache.checkCache.mockReturnValue(true);
    cache.getCache.mockReturnValue("cached-data");
    cache.getTtl.mockReturnValue(Date.now() + 5000);

    const res = await request(app)
      .get("/ability-sprite")
      .set("Authorization", "token123");

    expect(res.headers["x-cache"]).toBe("HIT");
    expect(res.body).toEqual({ status: "success", result: "cached-data" });
  });

  it("should handle unexpected errors gracefully", async () => {
    userV2.findByToken.mockResolvedValue({ currentAbilityId: 1 });
    ability.findById.mockResolvedValue({
      champion: { championKey: "Ahri" },
      key: "Q",
    });
    cache.checkCache.mockReturnValue(false);

    fsp.readFile.mockRejectedValue(new Error("Disk read error"));

    const res = await request(app)
      .get("/ability-sprite")
      .set("Authorization", "token123");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      status: "error",
      message: "Internal server error",
    });
  });
});
