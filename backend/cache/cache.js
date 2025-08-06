const Redis = require("ioredis");

class Cache {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      connectTimeout: 500,
    });

    this.redis.on("connect", () => {
      console.log("✅ Redis connection established");
    });

    this.redis.on("ready", () => {
      console.log("🔄 Redis connection is ready to use");
    });

    this.redis.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
    });

    this.redis.on("end", () => {
      console.warn("⚠️ Redis connection closed");
    });

    this.redis.on("reconnecting", () => {
      console.log("🔁 Redis reconnecting...");
    });
  }

  async set(key, value, ttlInSeconds = 3600) {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await this.redis.set(key, stringValue, "EX", ttlInSeconds);
    } catch (err) {
      console.error(`Redis SET error for key "${key}":`, err);
    }
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (err) {
      console.error(`Redis GET error for key "${key}":`, err);
      return null;
    }
  }

  async delete(key) {
    try {
      await this.redis.del(key);
    } catch (err) {
      console.error(`Redis DEL error for key "${key}":`, err);
    }
  }

  async has(key) {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (err) {
      console.error(`Redis EXISTS error for key "${key}":`, err);
      return false;
    }
  }

  async flush() {
    try {
      await this.redis.flushall();
    } catch (err) {
      console.error("Redis FLUSHALL error:", err);
    }
  }

  async updateTTL(key, ttlInSeconds) {
    try {
      const updated = await this.redis.expire(key, ttlInSeconds);
      return updated === 1;
    } catch (err) {
      console.error(`Redis EXPIRE error for key "${key}":`, err);
      return false;
    }
  }

  async sadd(key, member) {
    try {
      return await this.redis.sadd(key, member);
    } catch (err) {
      console.error(`Redis SADD error for key "${key}":`, err);
      return false;
    }
  }

  quit() {
    this.redis.quit();
  }
}

module.exports = new Cache();
