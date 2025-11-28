/**
 * Redis key generation utilities for guess count tracking
 * Centralizes key generation logic for easier maintenance
 */

const generateGuessCountKey = (userId, gameType) => {
  return `userId:${userId}:${gameType}:guessCount`;
};

const GuessCountKeys = {
  champion: (userId) => generateGuessCountKey(userId, "champion"),
  splash: (userId) => generateGuessCountKey(userId, "splash"),
  item: (userId) => generateGuessCountKey(userId, "item"),
  oldItem: (userId) => generateGuessCountKey(userId, "oldItem"),
  ability: (userId) => generateGuessCountKey(userId, "ability"),
};

module.exports = {
  GuessCountKeys,
};
