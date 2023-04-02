const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60, checkperiod: 30 });

const getCache = (key) => {
  const value = cache.get(key);
  if (value !== undefined) {
    return value;
  }
};

const checkCache = (key) => {
  return cache.has(key);
};

const saveCache = (key, value) => {
  cache.set(key, value);
};

const deleteCache = (key, value) => {
  cache.del(key, value);
};

module.exports = { getCache, checkCache, saveCache, deleteCache };
