const roomService = require("./roomService");
const gameService = require("./gameService");
const userV2 = require("../models/v2/user");
const {
  checkRate,
  incrementGuessCount,
  resetSession,
} = require("./rateLimiter");

const ROUND_TRANSITION_DELAY_MS = 3000;
const PAUSE_AUTO_RESUME_DELAY_MS = 15000;

// Map from socketId to { code, userId }
const socketToSession = new Map();

// Map from socketId to { userId, nickname }
const socketToUser = new Map();

// Map from userId to socketId (used to locate a player's socket for kick)
const userToSocket = new Map();

// Map from code to pauseTimeout timer
const pauseTimers = new Map();

function setupVersusSocket(io) {
  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.emit("error", { message: "Authentication required" });
      socket.disconnect(true);
      return;
    }

    let dbUser;
    try {
      dbUser = await userV2.findByToken(token);
    } catch (err) {
      socket.emit("error", { message: "Authentication error" });
      socket.disconnect(true);
      return;
    }

    if (!dbUser) {
      socket.emit("error", { message: "Invalid token" });
      socket.disconnect(true);
      return;
    }

    const { id: userId, nickname } = dbUser;
    socketToUser.set(socket.id, { userId, nickname });
    userToSocket.set(userId, socket.id);

    console.log(`[versus] Socket connected: ${socket.id} (user: ${userId})`);

    socket.onAny((event, ...args) => {
      console.log(`[IN] ${event}`, args);
    });

    socket.emit("authenticated", { userId });

    // createRoom: { settings }
    socket.on("createRoom", async ({ settings } = {}) => {
      if (!checkRate(socket, "createRoom")) return;
      try {
        const { userId: uid, nickname: nick } = socketToUser.get(socket.id);
        const room = roomService.createRoom(uid, nick);
        await roomService.setRoom(room.code, room);

        socketToSession.set(socket.id, { code: room.code, userId: uid });
        socket.join(room.code);

        socket.emit("roomCreated", {
          room: sanitizeRoom(room),
          myUserId: uid,
        });
      } catch (err) {
        console.log(
          `Failed to create room: ${err.message} (UID: ${socketToUser.get(socket.id)?.userId})`,
        );
        socket.emit("error", { message: "Failed to create room" });
      }
    });

    // joinRoom: { code }
    socket.on("joinRoom", async ({ code } = {}) => {
      if (!checkRate(socket, "joinRoom")) return;
      try {
        if (!code) return socket.emit("error", { message: "Code is required" });

        const { userId: uid, nickname: nick } = socketToUser.get(socket.id);
        const result = await roomService.addPlayer(
          code.toUpperCase(),
          uid,
          nick,
        );

        if (result.error)
          return socket.emit("error", { message: result.error });

        socketToSession.set(socket.id, {
          code: result.room.code,
          userId: uid,
        });
        socket.join(result.room.code);

        socket.emit("roomJoined", {
          room: sanitizeRoom(result.room),
          myUserId: uid,
        });
        socket.to(result.room.code).emit("playerJoined", {
          player: result.player,
          room: sanitizeRoom(result.room),
        });
      } catch (err) {
        console.log(
          `Failed to join a room: ${err.message} (UID: ${socketToUser.get(socket.id)?.userId})`,
        );
        socket.emit("error", { message: "Failed to join a room" });
      }
    });

    // reconnect: { code }
    socket.on("reconnect", async ({ code } = {}) => {
      try {
        if (!code) return socket.emit("error", { message: "Code is required" });

        const { userId: uid } = socketToUser.get(socket.id);
        const result = await roomService.reconnectPlayer(
          code.toUpperCase(),
          uid,
        );
        if (result.error)
          return socket.emit("error", { message: result.error });

        socketToSession.set(socket.id, {
          code: result.room.code,
          userId: uid,
        });
        socket.join(result.room.code);

        socket.emit("roomJoined", {
          room: sanitizeRoom(result.room),
          myUserId: uid,
        });

        if (result.resumed) {
          clearPauseTimer(result.room.code);
          io.to(result.room.code).emit("gameResumed", {
            room: sanitizeRoom(result.room),
          });
        }
      } catch (err) {
        console.log(
          `Failed to reconnect to a room: ${err.message} (UID: ${socketToUser.get(socket.id)?.userId}) Room code: ${code})`,
        );
        socket.emit("error", { message: "Failed to join a room" });
      }
    });

    // leaveRoom
    socket.on("leaveRoom", async () => {
      await handlePlayerLeave(socket, io, "leave");
    });

    // kickPlayer: { playerId } — playerId is the target DB userId
    socket.on("kickPlayer", async ({ playerId: targetUserId } = {}) => {
      try {
        const session = socketToSession.get(socket.id);
        if (!session) return socket.emit("error", { message: "Not in a room" });

        const { userId: hostUserId } = socketToUser.get(socket.id);
        const result = await roomService.kickPlayer(
          session.code,
          hostUserId,
          targetUserId,
        );
        if (result.error)
          return socket.emit("error", { message: result.error });

        // Notify, disconnect the kicked player's socket, and clean up maps
        const kickedSocketId = userToSocket.get(targetUserId);
        if (kickedSocketId) {
          const kickedSocket = io.sockets.sockets.get(kickedSocketId);
          if (kickedSocket) {
            socketToSession.delete(kickedSocketId);
            socketToUser.delete(kickedSocketId);
            kickedSocket.leave(session.code);
            kickedSocket.emit("kicked", {
              message: "You were kicked from the room",
            });
            kickedSocket.disconnect(true);
          }
          userToSocket.delete(targetUserId);
        }

        io.to(session.code).emit("playerKicked", {
          kicked: {
            id: targetUserId,
            nickname: result.kicked.nickname,
          },
          room: sanitizeRoom(result.room),
        });
      } catch (err) {
        console.log(`Failed to kick player: ${err.message}`);
        socket.emit("error", { message: "Failed to kick player" });
      }
    });

    // updateSettings: { settings } — host only
    socket.on("updateSettings", async ({ settings } = {}) => {
      if (!checkRate(socket, "updateSettings")) return;
      try {
        const session = socketToSession.get(socket.id);
        if (!session) return socket.emit("error", { message: "Not in a room" });

        const { userId: uid } = socketToUser.get(socket.id);
        const result = await roomService.updateSettings(
          session.code,
          uid,
          settings,
        );
        if (result.error)
          return socket.emit("error", { message: result.error });

        io.to(session.code).emit("settingsUpdated", {
          room: sanitizeRoom(result.room),
        });
      } catch (err) {
        console.log(`Failed to update settings: ${err.message}`);
        socket.emit("error", { message: "Failed to update settings" });
      }
    });

    // returnToLobby — host only, after game_end
    socket.on("returnToLobby", async () => {
      try {
        const session = socketToSession.get(socket.id);
        if (!session) return socket.emit("error", { message: "Not in a room" });

        const { userId: uid } = socketToUser.get(socket.id);
        const result = await roomService.returnToLobby(session.code, uid);
        if (result.error)
          return socket.emit("error", { message: result.error });

        io.to(session.code).emit("lobbyReset", {
          room: sanitizeRoom(result.room),
        });
      } catch (err) {
        console.log(`Failed to return to lobby: ${err.message}`);
        socket.emit("error", { message: "Return to lobby failed" });
      }
    });

    // startGame
    socket.on("startGame", async () => {
      try {
        const session = socketToSession.get(socket.id);
        if (!session) return socket.emit("error", { message: "Not in a room" });

        const { userId: uid } = socketToUser.get(socket.id);
        const room = await roomService.getRoom(session.code);
        if (!room) return socket.emit("error", { message: "Room not found" });
        if (room.hostId !== uid)
          return socket.emit("error", { message: "Only host can start" });

        const startResult = await gameService.startGame(session.code);
        if (startResult.error)
          return socket.emit("error", { message: startResult.error });

        io.to(session.code).emit("gameStarted", {
          room: sanitizeRoom(startResult.room),
        });

        await beginRound(session.code, io);
      } catch (err) {
        console.log(`Failed to start a game: ${err.message}`);
        socket.emit("error", { message: "Failed to start a game" });
      }
    });

    // forceResumeGame
    socket.on("forceResumeGame", async () => {
      try {
        const session = socketToSession.get(socket.id);
        if (!session) return socket.emit("error", { message: "Not in a room" });

        const { userId: uid } = socketToUser.get(socket.id);
        const room = await roomService.getRoom(session.code);
        if (!room) return socket.emit("error", { message: "Room not found" });
        if (room.hostId !== uid)
          return socket.emit("error", {
            message: "Only host can force resume",
          });

        const resumed = await gameService.resumeGame(session.code);
        if (!resumed)
          return socket.emit("error", { message: "Game is not paused" });

        clearPauseTimer(session.code);
        io.to(session.code).emit("gameResumed", {
          room: sanitizeRoom(resumed),
        });
      } catch (err) {
        console.log(`Failed to force resume game: ${err.message}`);
        socket.emit("error", { message: "Force resume failed" });
      }
    });

    // submitGuess: { guess }
    socket.on("submitGuess", async ({ guess } = {}) => {
      if (!checkRate(socket, "submitGuess")) return;
      if (!incrementGuessCount(socket, socketToSession.get(socket.id)?.code)) {
        return;
      }

      try {
        const session = socketToSession.get(socket.id);
        if (!session) return socket.emit("error", { message: "Not in a room" });
        if (!guess)
          return socket.emit("error", { message: "Guess is required" });

        const { userId: uid } = socketToUser.get(socket.id);
        const result = await gameService.handleGuess(session.code, uid, guess);
        if (result.error)
          return socket.emit("error", { message: result.error });

        if (!result.correct) {
          // For champion mode, send comparison feedback to the guesser only
          if (result.guessData) {
            socket.emit("guessResult", result.guessData);
          }
          return;
        }

        io.to(session.code).emit("correctGuess", {
          playerId: uid,
          nickname: result.winner.nickname,
          answer: result.answer,
          scores: result.scores,
        });

        setTimeout(async () => {
          await advanceRound(session.code, io);
        }, ROUND_TRANSITION_DELAY_MS);
      } catch (err) {
        console.log(`Failed to submit guess: ${err.message}`);
        socket.emit("error", { message: "Guess failed" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      resetSession(socket);
      const userInfo = socketToUser.get(socket.id);
      if (userInfo && userToSocket.get(userInfo.userId) === socket.id) {
        userToSocket.delete(userInfo.userId);
      }
      socketToUser.delete(socket.id);
      console.log(
        `[versus] Socket disconnected: ${socket.id} (user: ${userInfo?.userId})`,
      );
      await handlePlayerLeave(socket, io, "disconnect");
    });
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
}

async function handlePlayerLeave(socket, io, reason) {
  const session = socketToSession.get(socket.id);
  if (!session) return;

  socketToSession.delete(socket.id);

  const room = await roomService.getRoom(session.code);
  if (!room) return;

  if (reason === "disconnect" && room.state === "in_round") {
    const paused = await gameService.pauseGame(session.code, session.userId);

    if (paused) {
      io.to(session.code).emit("gamePaused", {
        pauseState: paused.pauseState,
      });

      if (pauseTimers.has(session.code)) {
        clearTimeout(pauseTimers.get(session.code));
      }

      const timer = setTimeout(async () => {
        pauseTimers.delete(session.code);

        const currentRoom = await roomService.getRoom(session.code);
        if (!currentRoom || currentRoom.state !== "paused") return;

        const resumed = await gameService.resumeGame(session.code);
        if (resumed) {
          io.to(session.code).emit("gameResumed", {
            room: sanitizeRoom(resumed),
          });
        }
      }, PAUSE_AUTO_RESUME_DELAY_MS);

      pauseTimers.set(session.code, timer);
    }
  }

  if (reason !== "disconnect") {
    const result = await roomService.removePlayer(session.code, session.userId);
    if (!result) return;
    if (result.deleted) return;

    io.to(session.code).emit("playerLeft", {
      playerId: session.userId,
      room: sanitizeRoom(result.room),
    });

    if (result.hostChanged) {
      io.to(session.code).emit("hostChanged", {
        newHostId: result.room.hostId,
        room: sanitizeRoom(result.room),
      });
    }
  }

  socket.leave(session.code);
}

function clearPauseTimer(code) {
  const timer = pauseTimers.get(code);
  if (timer) {
    clearTimeout(timer);
    pauseTimers.delete(code);
  }
}

async function beginRound(code, io) {
  const result = await gameService.startRound(code);
  if (result.error) {
    io.to(code).emit("error", { message: result.error });
    return;
  }

  io.to(code).emit("roundStarted", {
    round: result.room.currentRound,
    maxRounds: result.room.maxRounds,
    mode: result.mode,
    // roundData only contains non-identifying info (itemId for item mode)
    roundData: result.roundData,
    // imageBase64 is included for image-based modes; null for champion
    imageBase64: result.imageBase64 || null,
  });
}

async function advanceRound(code, io) {
  const endResult = await gameService.endRound(code);
  if (!endResult || endResult.error) return;

  io.to(code).emit("roundEnded", {
    roundNumber: endResult.room.currentRound,
  });

  if (endResult.gameOver) {
    const scoreboard = gameService.getScoreboard(endResult.room);
    io.to(code).emit("gameEnded", { scoreboard });
    return;
  }

  await beginRound(code, io);
}

function sanitizeRoom(room) {
  const { currentAnswer, currentServerData, currentRoundData, ...safeRoom } =
    room;
  return safeRoom;
}

module.exports = setupVersusSocket;
