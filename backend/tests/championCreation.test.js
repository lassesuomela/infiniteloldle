const app = require("../app");
const request = require("supertest");
require("dotenv").config();

describe("Testing champion data insertion to db", () => {
  const secret = process.env.TOKEN;

  it("Fetching champion keys without secret.", (done) => {
    request(app)
      .get("/dev/api/champion/keys")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Fetching champion keys with correct secret.", (done) => {
    request(app)
      .get("/dev/api/champion/keys")
      .set("Authorization", "Bearer " + secret)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("championKeys");

        done();
      });
  });

  it("Testing secret checking with wrong secret.", (done) => {
    request(app)
      .put("/dev/api/champion/id")
      .set("Authorization", "Bearer " + "secret")

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating champion without body.", (done) => {
    request(app)
      .post("/dev/api/champion")
      .set("Authorization", "Bearer " + secret)

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Creating champion with body.", (done) => {
    const body = {
      name: "Name",
      title: "Title",
      resource: "resource",
      skinCount: 10,
      spriteIds: "0,1,2",
      genre: "genre",
      gender: "1",
    };

    request(app)
      .post("/dev/api/champion")
      .set("Authorization", "Bearer " + secret)
      .send(body)

      .then((res) => {
        console.log(res.body);

        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Adding more data to created champion with no body.", (done) => {
    request(app)
      .put("/dev/api/champion")
      .set("Authorization", "Bearer " + secret)

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Adding more data to created champion.", (done) => {
    const data = {
      champion: "Name",
      data: [
        { released: "2000" },
        { region: "Region" },
        { positions: "Position" },
        { rangeTypes: "Range" },
        { damageType: "damageType" },
      ],
    };

    request(app)
      .put("/dev/api/champion")
      .set("Authorization", "Bearer " + secret)
      .send(data)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Adding champion id to created champion with no body.", (done) => {
    request(app)
      .put("/dev/api/champion/id")
      .set("Authorization", "Bearer " + secret)

      .then((res) => {
        expect(res.body.status).toBe("error");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });

  it("Adding champion id to created champion.", (done) => {
    const data = {
      name: "Name",
      key: "Name",
    };

    request(app)
      .put("/dev/api/champion/id")
      .set("Authorization", "Bearer " + secret)
      .send(data)

      .then((res) => {
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");

        done();
      });
  });
});
