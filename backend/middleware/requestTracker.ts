import type { NextFunction, Request, Response } from "express";

const statsModel = require("../models/statsModel");
const cache = require("./cache");

const redisCache = require("../cache/cache");

const REQUESTS_KEY = "stats:requests";
const DAU_KEY = "stats:dau";
const TOKENS_KEY = "stats:tokens";

type UserPlayerCounts = [
  Array<{ user_count: number }>,
  Array<{ player_count: number }>,
];

const toInteger = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const trackRequests = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  if (process.env["NODE_ENV"] === "test") {
    next();
    return;
  }
  try {
    const requests = toInteger(await redisCache.get(REQUESTS_KEY));
    await redisCache.set(REQUESTS_KEY, requests + 1, 24 * 3600);
  } catch (error: unknown) {
    console.error("Error incrementing requests", error);
  }
  next();
};

const trackDAU = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  if (process.env["NODE_ENV"] === "test") {
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
      await redisCache.set(DAU_KEY, toInteger(dau) + 1, 24 * 3600);
    }
    await redisCache.updateTTL(TOKENS_KEY, 24 * 3600);
  } catch (error: unknown) {
    console.error("Error tracking DAU token", error);
  }
  next();
};

// Save stats to DB and reset Redis counters
const saveStats = async (): Promise<void> => {
  if (process.env["NODE_ENV"] === "test") {
    console.log("Skipping stats saving in test environment");
    return;
  }
  console.log("Saving to db");

  try {
    const requests = toInteger(await redisCache.get(REQUESTS_KEY));
    const dau = toInteger(await redisCache.get(DAU_KEY));

    // Clear tokens Redis set (unique users)
    await redisCache.delete(TOKENS_KEY);

    statsModel.getUsersAndPlayers(
      (err: Error | null, data: UserPlayerCounts) => {
        if (err) {
          console.log(err);
        } else {
          const payload = {
            date: new Date(),
            dau,
            requests,
            mostActiveUsers: [].join(", "),
            users: data[0][0].user_count,
            players: data[1][0].player_count,
          };

          statsModel.create(
            payload,
            async (err: Error | null, result: unknown): Promise<void> => {
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
            },
          );
        }
      },
    );
  } catch (error: unknown) {
    console.error("Failed to save stats", error);
  }
};

module.exports = { trackRequests, saveStats, trackDAU };
