const CheckToken = require("../../controllers/userController").CheckToken;
const user = require("../../models/userModel");

jest.mock("../../models/userModel");

describe("CheckToken", () => {
  let req, res;

  beforeEach(() => {
    req = {
      token: "abc123",
      path: "/api/test",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn(),
    };
  });

  it("should return 500 if DB error occurs (errno -111)", () => {
    user.fetchByTokenForUserDataAPI.mockImplementation((token, cb) => {
      cb({ errno: -111 }, null);
    });

    CheckToken(req, res);

    expect(user.fetchByTokenForUserDataAPI).toHaveBeenCalledWith(
      "abc123",
      expect.any(Function)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Error on fetching user",
    });
  });

  it("should return token invalid if no user found and no DB error", () => {
    user.fetchByTokenForUserDataAPI.mockImplementation((token, cb) => {
      cb(null, null); // No user
    });

    CheckToken(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Token is not valid",
    });
  });
});
