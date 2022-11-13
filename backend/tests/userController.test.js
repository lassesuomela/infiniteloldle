const app = require("../app");
const request = require("supertest");

describe("Testing userController routes", () => {

    let token = "";

    it("Creating user account with nickname defined.", (done) => {

        const body = {
            nickname: "jestuser"
        }

        request(app)
            .post("/api/user")
            .send(body)

            .then(res => {
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("token");

                token = res.body.token;

                done();
            })
    });

    it("Checking if token is valid.", (done) => {

        request(app)
            .get("/api/user")
            .set("Authorization", "Bearer " + token)

            .then(res => {
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("message");
                expect(res.body).toHaveProperty("player");

                done();
            })
    });

    it("Checking if token is valid. With no token.", (done) => {

        request(app)
            .get("/api/user")

            .then(res => {
                expect(res.body.status).toBe("error");
                expect(res.body).toHaveProperty("message");

                done();
            })
    });

    it("Creating user account without nickname.", (done) => {

        request(app)
            .post("/api/user")

            .then(res => {
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("token");

                done();
            })
    });

    it("Updating nickname, without nickname defined.", (done) => {
     
        request(app)
            .put("/api/user/nickname")
            .set("Authorization", "Bearer " + token)

            .then(res => {
                expect(res.body.status).toBe("error");
                expect(res.body).toHaveProperty("message");

                done();
            })
    });

    it("Updating nickname, with nickname.", (done) => {

        const body = {
            nickname: "newNicknameJest"
        }

        request(app)
            .put("/api/user/nickname")
            .send(body)
            .set("Authorization", "Bearer " + token)

            .then(res => {
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toBe("Nickname updated")

                done();
            })
    });

    it("Deleting user account, with valid token.", (done) => {

        request(app)
            .delete("/api/user")
            .set("Authorization", "Bearer " + token)

            .then(res => {
                expect(res.body.status).toBe("success");
                expect(res.body).toHaveProperty("message");

                done();
            })
    });

    it("Deleting user account, without token.", (done) => {

        request(app)
            .delete("/api/user")

            .then(res => {
                expect(res.body.status).toBe("error");
                expect(res.body).toHaveProperty("message");

                done();
            })
    });
});