const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

const getCache = (key) => {
  return cache.get(key);
};

const getTtl = (key) => {
  return cache.getTtl(key);
};

const checkCache = (key) => {
  return cache.has(key);
};

const saveCache = (key, value) => {
  cache.set(key, value);
};

const deleteCache = (key) => {
  cache.del(key);
};

const changeTTL = (key, ttl) => {
  cache.ttl(key, ttl);
};

const getStats = () => {
  return cache.getStats();
};

module.exports = {
  getTtl,
  changeTTL,
  getCache,
  checkCache,
  saveCache,
  deleteCache,
  getStats,
};
