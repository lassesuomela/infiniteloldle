const app = require("../app");
const request = require("supertest");

describe("Testing stats routes", () => {
  it("Fetching stats.", (done) => {
    request(app)
      .get("/api/stats")

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("champion_count");
        expect(res.body).toHaveProperty("global_skin_count");
        expect(res.body).toHaveProperty("item_count");
        expect(res.body).toHaveProperty("player_count");
        expect(res.body).toHaveProperty("player_stats");
        expect(res.body).toHaveProperty("register_count");
        expect(res.body).toHaveProperty("stats");
        expect(res.body).toHaveProperty("todays_player_count");
        expect(res.body).toHaveProperty("todays_players");
        expect(res.body).toHaveProperty("top_countries");
        expect(res.body).toHaveProperty("user_data");
        expect(res.body).toHaveProperty("dau");
        expect(res.body).toHaveProperty("mau");
        expect(res.body).toHaveProperty("old_item_count");
        expect(res.body).toHaveProperty("yesterdays_player_count");

        done();
      });
  });
});

export {};
