const redis = require("redis");
const client = redis.createClient({
  legacyMode: true,
  socket: {
    port: 6379,
    host: "redis",
  },
});
client.on("error", (err) => console.log("Redis Client Error", err));

const getCache = async (key) => {
  await client.connect();
  return JSON.parse(await client.hGet("cache", key));
};

const getTtl = async (key) => {
  await client.connect();
  return await client.ttl(`cache:${key}`);
};

const checkCache = async (key) => {
  await client.connect();
  return await client.hExists("cache", key);
};

const saveCache = async (key, value) => {
  await client.connect();
  await client.hSet("cache", key, JSON.stringify(value));
};

const deleteCache = async (key) => {
  await client.connect();
  await client.hDel("cache", key);
};

const changeTTL = async (key, ttl) => {
  await client.connect();
  await client.expire(`cache:${key}`, ttl);
};

module.exports = {
  getTtl,
  changeTTL,
  getCache,
  checkCache,
  saveCache,
  deleteCache,
};
