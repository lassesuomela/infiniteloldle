/**
 * Configuration for clue thresholds in the champion guessing game
 * This is the single source of truth for clue unlock requirements
 */

const clueConfig = {
  // Ability clue unlocks after this many guesses (easier)
  abilityClueThreshold: 5,
  
  // Splash art clue unlocks after this many guesses (harder)
  splashClueThreshold: 10,
};

module.exports = clueConfig;
