const app = require("../app");
const request = require("supertest");

describe("Testing scoreboard routes", () => {
  it("Fetching top 10 players.", (done) => {
    request(app)
      .get("/api/scoreboard")

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("scores");

        done();
      });
  });

  it("Testing cache. Fetching top 10 players.", (done) => {
    request(app)
      .get("/api/scoreboard")

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("scores");

        done();
      });
  });
});

export {};
