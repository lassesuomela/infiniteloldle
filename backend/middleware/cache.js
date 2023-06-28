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
  if (!client.isOpen) {
    await client.connect();
  }
  const value = JSON.parse(await client.hGet("cache", key));
  if (value === undefined || value === null) {
    return null;
  }
  return JSON.parse(await client.hGet("cache", key));
};

const getTtl = async (key) => {
  if (!client.isOpen) {
    await client.connect();
  }
  const ttl = await client.ttl(`cache:${key}`);
  if (ttl === undefined || ttl === null) {
    return null;
  }
  return ttl;
};

const checkCache = async (key) => {
  if (!client.isOpen) {
    console.log("connecting to redis");
    await client.connect();
  }
  const value = await client.hExists("cache", key);
  console.log("vlaue from redis ", value);
  if (value === 0 || value === null || value === undefined) {
    return false;
  }
  return true;
};

const saveCache = async (key, value) => {
  if (!client.isOpen) {
    await client.connect();
  }
  await client.hSet("cache", key, JSON.stringify(value));
  await changeTTL(key, 60);
};

const deleteCache = async (key) => {
  if (!client.isOpen) {
    await client.connect();
  }
  await client.hDel("cache", key);
};

const changeTTL = async (key, ttl) => {
  if (!client.isOpen) {
    await client.connect();
  }
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
