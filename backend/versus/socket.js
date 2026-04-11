const roomService = require("./roomService");
const gameService = require("./gameService");

const ROUND_TRANSITION_DELAY_MS = 3000;
const PAUSE_AUTO_RESUME_DELAY_MS = 15000;

// Map from socketId to { code, playerId }
const socketToRoom = new Map();

// Map from code to pauseTimeout timer
const pauseTimers = new Map();

function setupVersusSocket(io) {
  io.on("connection", (socket) => {
    console.log(`[versus] Socket connected: ${socket.id}`);

    // createRoom: { nickname, settings }
    socket.on("createRoom", async ({ nickname, settings } = {}) => {
      try {
        const playerId = socket.id;
        const room = roomService.createRoom(
          playerId,
          nickname || "Anonymous",
          settings
        );
        await roomService.setRoom(room.code, room);

        socketToRoom.set(socket.id, { code: room.code, playerId });
        socket.join(room.code);

        socket.emit("roomCreated", { room: sanitizeRoom(room) });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // joinRoom: { code, nickname }
    socket.on("joinRoom", async ({ code, nickname } = {}) => {
      try {
        if (!code)
          return socket.emit("error", { message: "Code is required" });

        const playerId = socket.id;
        const result = await roomService.addPlayer(
          code.toUpperCase(),
          playerId,
          nickname || "Anonymous"
        );

        if (result.error)
          return socket.emit("error", { message: result.error });

        socketToRoom.set(socket.id, {
          code: result.room.code,
          playerId,
        });
        socket.join(result.room.code);

        socket.emit("roomJoined", { room: sanitizeRoom(result.room) });
        socket.to(result.room.code).emit("playerJoined", {
          player: result.player,
          room: sanitizeRoom(result.room),
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // reconnect: { code, playerId }
    socket.on("reconnect", async ({ code, playerId } = {}) => {
      try {
        if (!code || !playerId)
          return socket.emit("error", {
            message: "Code and playerId required",
          });

        const result = await roomService.reconnectPlayer(
          code.toUpperCase(),
          playerId,
          socket.id
        );
        if (result.error)
          return socket.emit("error", { message: result.error });

        socketToRoom.set(socket.id, {
          code: result.room.code,
          playerId: socket.id,
        });
        socket.join(result.room.code);

        socket.emit("roomJoined", { room: sanitizeRoom(result.room) });

        if (result.resumed) {
          clearPauseTimer(result.room.code);
          io.to(result.room.code).emit("gameResumed", {
            room: sanitizeRoom(result.room),
          });
        }
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // leaveRoom
    socket.on("leaveRoom", async () => {
      await handlePlayerLeave(socket, io, "leave");
    });

    // kickPlayer: { playerId }
    socket.on("kickPlayer", async ({ playerId } = {}) => {
      try {
        const session = socketToRoom.get(socket.id);
        if (!session)
          return socket.emit("error", { message: "Not in a room" });

        const result = await roomService.kickPlayer(
          session.code,
          session.playerId,
          playerId
        );
        if (result.error)
          return socket.emit("error", { message: result.error });

        // Notify and disconnect the kicked player's socket
        const kickedSocket = io.sockets.sockets.get(playerId);
        if (kickedSocket) {
          socketToRoom.delete(playerId);
          kickedSocket.leave(session.code);
          kickedSocket.emit("playerKicked", {
            playerId,
            room: sanitizeRoom(result.room),
          });
        }

        io.to(session.code).emit("playerKicked", {
          playerId,
          room: sanitizeRoom(result.room),
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // startGame
    socket.on("startGame", async () => {
      try {
        const session = socketToRoom.get(socket.id);
        if (!session)
          return socket.emit("error", { message: "Not in a room" });

        const room = await roomService.getRoom(session.code);
        if (!room)
          return socket.emit("error", { message: "Room not found" });
        if (room.hostId !== session.playerId)
          return socket.emit("error", { message: "Only host can start" });

        const startResult = await gameService.startGame(session.code);
        if (startResult.error)
          return socket.emit("error", { message: startResult.error });

        io.to(session.code).emit("gameStarted", {
          room: sanitizeRoom(startResult.room),
        });

        // Start first round
        await beginRound(session.code, io);
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // forceResumeGame
    socket.on("forceResumeGame", async () => {
      try {
        const session = socketToRoom.get(socket.id);
        if (!session)
          return socket.emit("error", { message: "Not in a room" });

        const room = await roomService.getRoom(session.code);
        if (!room)
          return socket.emit("error", { message: "Room not found" });
        if (room.hostId !== session.playerId)
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
        socket.emit("error", { message: err.message });
      }
    });

    // submitGuess: { guess }
    socket.on("submitGuess", async ({ guess } = {}) => {
      try {
        const session = socketToRoom.get(socket.id);
        if (!session)
          return socket.emit("error", { message: "Not in a room" });
        if (!guess)
          return socket.emit("error", { message: "Guess is required" });

        const result = await gameService.handleGuess(
          session.code,
          session.playerId,
          guess
        );
        if (result.error)
          return socket.emit("error", { message: result.error });
        if (!result.correct) return;

        io.to(session.code).emit("correctGuess", {
          playerId: session.playerId,
          nickname: result.winner.nickname,
          answer: result.answer,
          scores: result.scores,
        });

        // Wait 3 seconds then advance round
        setTimeout(async () => {
          await advanceRound(session.code, io);
        }, ROUND_TRANSITION_DELAY_MS);
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`[versus] Socket disconnected: ${socket.id}`);
      await handlePlayerLeave(socket, io, "disconnect");
    });
  });
}

async function handlePlayerLeave(socket, io, reason) {
  const session = socketToRoom.get(socket.id);
  if (!session) return;
  socketToRoom.delete(socket.id);

  const room = await roomService.getRoom(session.code);
  if (!room) return;

  if (reason === "disconnect" && room.state === "in_round") {
    const paused = await gameService.pauseGame(
      session.code,
      session.playerId
    );
    if (paused) {
      io.to(session.code).emit("gamePaused", {
        pauseState: paused.pauseState,
      });

      // Auto-resume after 15 seconds
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

  const result = await roomService.removePlayer(
    session.code,
    session.playerId
  );
  if (!result) return;
  if (result.deleted) return;

  io.to(session.code).emit("playerLeft", {
    playerId: session.playerId,
    room: sanitizeRoom(result.room),
  });

  if (result.hostChanged) {
    io.to(session.code).emit("hostChanged", {
      newHostId: result.room.hostId,
      room: sanitizeRoom(result.room),
    });
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
    roundData: result.roundData,
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
  const { currentAnswer, ...safeRoom } = room;
  return safeRoom;
}

module.exports = setupVersusSocket;
