const app = require("../app");
const request = require("supertest");
require("dotenv").config();

describe("Testing item insertion to db", () => {
  const secret = process.env.TOKEN;

  it("Creating old item.", (done) => {
    const body = {
      name: "name",
      key: "key",
    };

    request(app)
      .post("/dev/api/oldItem")
      .set("Authorization", "Bearer " + secret)
      .send(body)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating old item with no body.", (done) => {
    request(app)
      .post("/dev/api/oldItem")
      .set("Authorization", "Bearer " + secret)

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating item with wrong secret.", (done) => {
    request(app)
      .post("/dev/api/oldItem")
      .set("Authorization", "Bearer " + "secret")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });
});
