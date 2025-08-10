const schedule = require("node-schedule");

jest.mock("node-schedule", () => ({
  scheduleJob: jest.fn(),
}));

jest.mock("ioredis", () => require("ioredis-mock"));
