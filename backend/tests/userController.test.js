const app = require("../app");
const request = require("supertest");

describe("Creating new user", () => {
    it("Should respond with status:success and have a token in the response body", (done) => {

        const body = {
            nickname: "jestuser"
        }

        request(app)
            .post("/api/user")
            .send(body)

            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("token");

                done();
            })
    });
});