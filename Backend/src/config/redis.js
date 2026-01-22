// config/redis.js
const Redis = require("ioredis");
const url = process.env.REDIS_URL || "redis://localhost:6379";

// Robust parsing for Windows/ioredis
const redis = new Redis(url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("Redis connected"));

module.exports = redis;
