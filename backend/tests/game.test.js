const app = require("../app");
const request = require("supertest");

describe("Testing routes needed for playing the game", () => {

    it("Fetching all champions.", (done) => {

        request(app)
            .get("/api/champions")

            .then(res => {
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("champions");

                done();
            })
    });

    it("Guessing without token.", (done) => {

        request(app)
            .post("/api/guess")

            .then(res => {
                expect(res.body.status).toBe("error");
                expect(res.body).toHaveProperty("message");

                done();
            })
    });

    it("Fetching splash art without token.", (done) => {

        request(app)
            .get("/api/guess")

            .then(res => {
                expect(res.body.status).toBe("error");
                expect(res.body).toHaveProperty("message");

                done();
            })
    });

});