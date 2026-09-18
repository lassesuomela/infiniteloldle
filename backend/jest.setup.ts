const { jest } = require("@jest/globals");

jest.mock("node-schedule", () => ({
  scheduleJob: jest.fn(),
}));

jest.mock("ioredis", () => require("ioredis-mock"));
