const app = require("../app");
const request = require("supertest");

describe("Testing routes needed for playing the game", () => {
  // token is not needed
  // items

  it("Fetching all items.", (done) => {
    request(app)
      .get("/api/items")

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("items");

        done();
      });
  });

  // champions

  it("Fetching all champions.", (done) => {
    request(app)
      .get("/api/champions")

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("champions");

        done();
      });
  });

  // token is needed
  it("Fetching users item id with no token provided.", (done) => {
    request(app)
      .get("/api/item")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Guessing champion without token.", (done) => {
    request(app)
      .post("/api/guess")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Fetching splash art without token.", (done) => {
    request(app)
      .get("/api/splash")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  // create test user to test
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

  it("Fetching users item id.", (done) => {
    request(app)
      .get("/api/item")
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("result");

        done();
      });
  });

  it("Fetching users old item id.", (done) => {
    request(app)
      .get("/api/oldItem")
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("result");

        done();
      });
  });

  it("Guessing old item with token.", (done) => {
    const body = {
      guess: "Adaptive Helm",
    };

    request(app)
      .post("/api/oldItem")
      .set("Authorization", "Bearer " + token)
      .send(body)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("correctGuess");
        expect(res.body).toHaveProperty("itemId");

        done();
      });
  });

  it("Guessing item with token.", (done) => {
    const body = {
      guess: "Sheen",
    };

    request(app)
      .post("/api/item")
      .set("Authorization", "Bearer " + token)
      .send(body)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("correctGuess");
        expect(res.body).toHaveProperty("itemId");

        done();
      });
  });

  it("Guessing champions with token.", (done) => {
    const body = {
      guess: "Teemo",
    };

    request(app)
      .post("/api/guess")
      .set("Authorization", "Bearer " + token)
      .send(body)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("correctGuess");
        expect(res.body).toHaveProperty("properties");

        done();
      });
  });

  it("Fetching splash art with token.", (done) => {
    request(app)
      .get("/api/splash")
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("result");
        expect(res.body.result).toHaveProperty("currentSplashId");
        expect(res.body.result).toHaveProperty("championKey");

        done();
      });
  });
});
