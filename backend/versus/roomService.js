const { getRoom, setRoom, deleteRoom } = require("./redis");

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function createPlayer(id, nickname) {
  return {
    id,
    nickname,
    score: 0,
    isConnected: true,
    joinedAt: Date.now(),
  };
}

function createRoom(hostId, nickname, settings = {}) {
  const code = generateCode();
  const mergedSettings = {
    maxPlayers: settings.maxPlayers || 16,
    rounds: settings.rounds || 10,
    gameModes: settings.gameModes || [
      "champion",
      "splash",
      "item",
      "legacy_item",
    ],
    hintsEnabled:
      settings.hintsEnabled !== undefined ? settings.hintsEnabled : true,
  };

  const host = createPlayer(hostId, nickname);
  return {
    id: `room_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    code,
    hostId,
    players: [host],
    settings: mergedSettings,
    state: "lobby",
    currentRound: 0,
    maxRounds: mergedSettings.rounds,
    currentAnswer: "",
    currentMode: "",
    currentRoundData: null,
    winnerId: null,
    pauseState: null,
    createdAt: Date.now(),
  };
}

async function addPlayer(code, playerId, nickname) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };
  if (room.state !== "lobby") return { error: "Game already started" };
  if (room.players.length >= room.settings.maxPlayers)
    return { error: "Room is full" };

  const existing = room.players.find((p) => p.id === playerId);
  if (existing) return { error: "Already in room" };

  const player = createPlayer(playerId, nickname);
  room.players.push(player);
  await setRoom(code, room);
  return { room, player };
}

async function removePlayer(code, playerId) {
  const room = await getRoom(code);
  if (!room) return null;

  const wasHost = room.hostId === playerId;
  room.players = room.players.filter((p) => p.id !== playerId);

  if (room.players.length === 0) {
    await deleteRoom(code);
    return { deleted: true };
  }

  if (wasHost) {
    const nextHost = room.players.slice().sort((a, b) => a.joinedAt - b.joinedAt)[0];
    room.hostId = nextHost.id;
  }

  await setRoom(code, room);
  return { room, hostChanged: wasHost };
}

async function kickPlayer(code, hostId, targetPlayerId) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };
  if (room.hostId !== hostId) return { error: "Only host can kick players" };
  if (room.state !== "lobby") return { error: "Can only kick in lobby" };

  const target = room.players.find((p) => p.id === targetPlayerId);
  if (!target) return { error: "Player not found" };

  room.players = room.players.filter((p) => p.id !== targetPlayerId);
  await setRoom(code, room);
  return { room, kicked: target };
}

async function reconnectPlayer(code, userId) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };

  const player = room.players.find((p) => p.id === userId);
  if (!player) return { error: "Player not found in room" };

  player.isConnected = true;

  let resumed = false;
  if (
    room.state === "paused" &&
    room.pauseState &&
    room.pauseState.disconnectedPlayerId === userId
  ) {
    room.state = "in_round";
    room.pauseState = null;
    resumed = true;
  }

  await setRoom(code, room);
  return { room, player, resumed };
}

module.exports = {
  createRoom,
  addPlayer,
  removePlayer,
  kickPlayer,
  reconnectPlayer,
  getRoom,
  setRoom,
};
