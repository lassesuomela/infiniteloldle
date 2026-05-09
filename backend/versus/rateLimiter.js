"use strict";

/**
 * Minimum milliseconds that must pass between successive calls of the same
 * event type on the same socket. Violations emit an error back to the caller
 * and return false — the handler must return immediately on false.
 */
const RATE_LIMITS_MS = {
  guess: 60,
  createRoom: 5000,
  joinRoom: 2000,
  settingsChanged: 200,
};

/**
 * Maximum total guesses a single socket may make across its lifetime.
 */
const MAX_GUESSES_PER_SESSION = 250 * 10; // Max options per game * max rounds per game

/**
 * After this many rate-limit violations on a single socket the connection is terminated.
 */
const MAX_VIOLATIONS_BEFORE_DISCONNECT = 20;

// ---------------------------------------------------------------------------
// Internal state keys (stored directly on the socket object so they are
// automatically garbage-collected when the socket closes — no Map cleanup
// needed)
// ---------------------------------------------------------------------------

const KEY_LAST_EVENTS = Symbol("rl_lastEvents"); // { [eventName]: timestamp }
const KEY_GUESS_COUNT = Symbol("rl_guessCount"); // number
const KEY_VIOLATIONS = Symbol("rl_violations"); // number

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _init(socket) {
  if (!socket[KEY_LAST_EVENTS]) socket[KEY_LAST_EVENTS] = {};
  if (socket[KEY_GUESS_COUNT] === undefined) socket[KEY_GUESS_COUNT] = 0;
  if (socket[KEY_VIOLATIONS] === undefined) socket[KEY_VIOLATIONS] = 0;
}

function _emitError(socket, code, message) {
  socket.emit("rateLimitError", { code, message });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * checkRate(socket, eventName)
 *
 * Returns true if the event is allowed to proceed, false if it is too soon.
 * On a false return the caller MUST return immediately without executing
 * any business logic.
 *
 * Side-effects on violation:
 *   - emits a "rateLimitError" event back to the offending socket
 *   - increments the violation counter
 *   - disconnects the socket if MAX_VIOLATIONS_BEFORE_DISCONNECT is reached
 *
 * @param {import("socket.io").Socket} socket
 * @param {string} eventName  - must be a key in RATE_LIMITS_MS
 * @returns {boolean}
 */
function checkRate(socket, eventName) {
  _init(socket);

  const minMs = RATE_LIMITS_MS[eventName];
  if (minMs === undefined) {
    // Event is not rate-limited — allow it through
    return true;
  }

  const now = Date.now();
  const last = socket[KEY_LAST_EVENTS][eventName] ?? 0;
  const elapsed = now - last;

  if (elapsed < minMs) {
    socket[KEY_VIOLATIONS]++;

    _emitError(
      socket,
      "TOO_FAST",
      `Please wait ${minMs - elapsed}ms before sending "${eventName}" again.`,
    );

    if (socket[KEY_VIOLATIONS] >= MAX_VIOLATIONS_BEFORE_DISCONNECT) {
      console.warn(
        `[rateLimiter] Disconnecting socket ${socket.id} after ${socket[KEY_VIOLATIONS]} rate-limit violations.`,
      );
      socket.disconnect(true);
    }

    return false;
  }

  // Allowed — record the timestamp
  socket[KEY_LAST_EVENTS][eventName] = now;
  return true;
}

/**
 * incrementGuessCount(socket, roomCode)
 *
 * Tracks the total number of guesses made by this socket across all rooms.
 * Returns true if the guess is within the session ceiling, false if the
 * socket has exceeded MAX_GUESSES_PER_SESSION.
 *
 * @param {import("socket.io").Socket} socket
 * @param {string} roomCode  - used only for the disconnect log message
 * @returns {boolean}
 */
function incrementGuessCount(socket, roomCode) {
  _init(socket);

  socket[KEY_GUESS_COUNT]++;

  if (socket[KEY_GUESS_COUNT] > MAX_GUESSES_PER_SESSION) {
    console.warn(
      `[rateLimiter] Socket ${socket.id} exceeded ${MAX_GUESSES_PER_SESSION} guesses in room ${roomCode}. Disconnecting.`,
    );
    _emitError(
      socket,
      "GUESS_LIMIT_EXCEEDED",
      "You have exceeded the maximum number of guesses for this session.",
    );
    socket.disconnect(true);
    return false;
  }

  return true;
}

/**
 * resetSession(socket)
 *
 * Clears all rate-limit state for a socket. Should be called on disconnect to prevent old state from affecting new sessions on the same socket.
 *
 * @param {import("socket.io").Socket} socket
 */
function resetSession(socket) {
  delete socket[KEY_LAST_EVENTS];
  delete socket[KEY_GUESS_COUNT];
  delete socket[KEY_VIOLATIONS];
}

/**
 * getRateLimitConfig()
 *
 * Returns a copy of the current configuration. Useful for logging and tests.
 *
 * @returns {{ limits: object, maxGuesses: number, maxViolations: number }}
 */
function getRateLimitConfig() {
  return {
    limits: { ...RATE_LIMITS_MS },
    maxGuesses: MAX_GUESSES_PER_SESSION,
    maxViolations: MAX_VIOLATIONS_BEFORE_DISCONNECT,
  };
}

module.exports = {
  checkRate,
  incrementGuessCount,
  resetSession,
  getRateLimitConfig,
};
