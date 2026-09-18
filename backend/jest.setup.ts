const jestApi = require("@jest/globals");

jestApi.jest.mock("node-schedule", () => ({
  scheduleJob: jestApi.jest.fn(),
}));

jestApi.jest.mock("ioredis", () => require("ioredis-mock"));
