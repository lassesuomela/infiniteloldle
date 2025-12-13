const statsModel = require("../models/statsModel");
const cache = require("./cache");

const redisCache = require("../cache/cache");

const REQUESTS_KEY = "stats:requests";
const DAU_KEY = "stats:dau";
const TOKENS_KEY = "stats:tokens";

const trackRequests = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    next();
    return;
  }
  try {
    let requests = await redisCache.get(REQUESTS_KEY);
    if (!requests) requests = 0;
    await redisCache.set(REQUESTS_KEY, parseInt(requests, 10) + 1, 24 * 3600);
  } catch (e) {
    console.error("Error incrementing requests", e);
  }
  next();
};

const trackDAU = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    next();
    return;
  }
  if (!req.token) return next();

  const token = req.token.substring(0, 40);
  try {
    const added = await redisCache.sadd(TOKENS_KEY, token);
    if (added === 1) {
      let dau = await redisCache.get(DAU_KEY);
      if (!dau) dau = 0;
      await redisCache.set(DAU_KEY, parseInt(dau, 10) + 1, 24 * 3600);
    }
    await redisCache.updateTTL(TOKENS_KEY, 24 * 3600);
  } catch (e) {
    console.error("Error tracking DAU token", e);
  }
  next();
};

// Save stats to DB and reset Redis counters
const saveStats = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Skipping stats saving in test environment");
    return;
  }
  console.log("Saving to db");

  try {
    const requests = parseInt(await redisCache.get(REQUESTS_KEY), 10) || 0;
    const dau = parseInt(await redisCache.get(DAU_KEY), 10) || 0;

    // Clear tokens Redis set (unique users)
    await redisCache.delete(TOKENS_KEY);

    statsModel.getUsersAndPlayers((err, data) => {
      if (err) {
        console.log(err);
      } else {
        const payload = {
          date: new Date(),
          dau,
          requests,
          mostActiveUsers: [].join(", ").toString(),
          users: data[0][0].user_count,
          players: data[1][0].player_count,
        };

        statsModel.create(payload, async (err, result) => {
          if (err) {
            console.log("Error saving stats to DB:");
            console.log(err);
          } else {
            console.log("Stats saved to DB:", result);
          }

          cache.deleteCache("/stats");
          // Reset counters in Redis
          await redisCache.delete(REQUESTS_KEY);
          await redisCache.delete(DAU_KEY);
        });
      }
    });
  } catch (err) {
    console.error("Failed to save stats", err);
  }
};

module.exports = { trackRequests, saveStats, trackDAU };
