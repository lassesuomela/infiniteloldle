const redisCache = require("../cache/cache");

const ROOM_TTL = 1800; // 30 minutes

async function getRoom(code) {
  return redisCache.get(`room:${code}`);
}

async function setRoom(code, room) {
  await redisCache.set(`room:${code}`, room, ROOM_TTL);
}

async function deleteRoom(code) {
  await redisCache.delete(`room:${code}`);
}

module.exports = { getRoom, setRoom, deleteRoom };
