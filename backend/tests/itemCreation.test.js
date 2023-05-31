const app = require("../app");
const request = require("supertest");
require("dotenv").config();

describe("Testing item insertion to db", () => {
  const secret = process.env.TOKEN;

  it("Creating item.", (done) => {
    const body = {
      name: "name",
      id: 1,
    };

    request(app)
      .post("/dev/api/item")
      .set("Authorization", "Bearer " + secret)
      .send(body)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating item with no body.", (done) => {
    request(app)
      .post("/dev/api/item")
      .set("Authorization", "Bearer " + secret)

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating item with wrong secret.", (done) => {
    request(app)
      .post("/dev/api/item")
      .set("Authorization", "Bearer " + "secret")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });
});
