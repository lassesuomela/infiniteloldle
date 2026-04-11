const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cache = require("../middleware/cache");

const router = express.Router();

const SPLASH_DIR = path.resolve(__dirname, "../images/champions/splash");
const OLD_ITEMS_DIR = path.resolve(__dirname, "../old_items");

const SAFE_KEY_PATTERN = /^[a-zA-Z0-9_]+$/;

function buildSafePath(baseDir, fileName) {
  const resolved = path.resolve(baseDir, fileName);
  if (!resolved.startsWith(baseDir + path.sep) && resolved !== baseDir) {
    return null;
  }
  return resolved;
}

/**
 * GET /api/versus/splash/:championKey/:skinKey
 * Returns base64-encoded splash art for a specific champion skin.
 * Does not require user authentication.
 */
router.get("/versus/splash/:championKey/:skinKey", async (req, res) => {
  try {
    const { championKey, skinKey } = req.params;

    if (!championKey || !skinKey) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid parameters" });
    }

    if (!SAFE_KEY_PATTERN.test(championKey) || !SAFE_KEY_PATTERN.test(skinKey)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid parameters" });
    }

    const imageName = path.basename(`${championKey}_${skinKey}.webp`);
    const cacheKey = `versus:splash:${imageName}`;

    if (cache.checkCache(cacheKey)) {
      res.set("X-CACHE", "HIT");
      return res.json({ status: "success", result: cache.getCache(cacheKey) });
    }

    const imagePath = buildSafePath(SPLASH_DIR, imageName);
    if (!imagePath) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid parameters" });
    }

    const file = await fs.readFile(imagePath);
    const base64 = file.toString("base64");

    cache.saveCache(cacheKey, base64);
    cache.changeTTL(cacheKey, 3600 * 6);

    res.set("X-CACHE", "MISS");
    return res.json({ status: "success", result: base64 });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res
        .status(404)
        .json({ status: "error", message: "Splash art not found" });
    }
    console.error("Error in versus splash route:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

/**
 * GET /api/versus/oldItem/:key
 * Returns base64-encoded old item image for a specific old item key.
 * Does not require user authentication.
 */
router.get("/versus/oldItem/:key", async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid parameters" });
    }

    if (!SAFE_KEY_PATTERN.test(key)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid parameters" });
    }

    const imageName = path.basename(`${key}.webp`);
    const cacheKey = `versus:oldItem:${imageName}`;

    if (cache.checkCache(cacheKey)) {
      res.set("X-CACHE", "HIT");
      return res.json({ status: "success", result: cache.getCache(cacheKey) });
    }

    const imagePath = buildSafePath(OLD_ITEMS_DIR, imageName);
    if (!imagePath) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid parameters" });
    }

    const file = await fs.readFile(imagePath);
    const base64 = file.toString("base64");

    cache.saveCache(cacheKey, base64);
    cache.changeTTL(cacheKey, 3600 * 6);

    res.set("X-CACHE", "MISS");
    return res.json({ status: "success", result: base64 });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res
        .status(404)
        .json({ status: "error", message: "Old item image not found" });
    }
    console.error("Error in versus oldItem route:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;
