const app = require("../app");
const request = require("supertest");

describe("Testing userController routes", () => {
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

  it("Checking if token is valid.", (done) => {
    request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("player");

        done();
      });
  });

  it("Checking if token is valid with invalid token.", (done) => {
    request(app)
      .get("/api/user")
      .set("Authorization", "Bearer " + "invalid token type")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Checking if token is valid. With no token.", (done) => {
    request(app)
      .get("/api/user")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating user account without nickname.", (done) => {
    request(app)
      .post("/api/user")

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("token");

        done();
      });
  });

  it("Updating nickname, without nickname defined.", (done) => {
    request(app)
      .put("/api/user/nickname")
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Updating nickname, with nickname.", (done) => {
    const body = {
      nickname: "newNicknameJest",
    };

    request(app)
      .put("/api/user/nickname")
      .send(body)
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Nickname updated");

        done();
      });
  });

  it("Updating nickname, with too long nickname.", (done) => {
    const body = {
      nickname:
        "newNicknameJestnewNicknameJestnewNicknameJestnewNicknameJestnewNicknameJestnewNicknameJestnewNicknameJest",
    };

    request(app)
      .put("/api/user/nickname")
      .send(body)
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Nickname updated");

        done();
      });
  });

  it("Change champion guess", async () => {
    const res = await request(app)
      .put("/api/user/champion")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toMatch(/Changed guess to champion game/);
  });

  it("Change champion splash guess", async () => {
    const res = await request(app)
      .put("/api/user/splash")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toMatch(/Changed splash guess/);
  });

  it("Change champion item guess", async () => {
    const res = await request(app)
      .put("/api/user/item")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toMatch(/Changed item guess/);
  });

  it("Change old item guess", async () => {
    const res = await request(app)
      .put("/api/user/oldItem")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toMatch(/Changed old item guess/);
  });

  it("Deleting user account, with valid token.", (done) => {
    request(app)
      .delete("/api/user")
      .set("Authorization", "Bearer " + token)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Deleting user account, without token.", (done) => {
    request(app)
      .delete("/api/user")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Change ability guess", async () => {
    const res = await request(app)
      .put("/api/user/ability")
      .set("Authorization", "Bearer " + token);

    expect(res.body.status).toBe("success");
    expect(res.body.message).toMatch(/Changed ability guess/);
  });
});
