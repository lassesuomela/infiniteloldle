const schedule = require("node-schedule");

jest.mock("node-schedule", () => ({
  scheduleJob: jest.fn(),
}));
