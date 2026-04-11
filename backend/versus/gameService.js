const { getRoom, setRoom } = require("./redis");
const championV2 = require("../models/v2/champion");
const itemV2 = require("../models/v2/item");
const oldItemV2 = require("../models/v2/oldItem");
const skinV2 = require("../models/v2/skin");

const PAUSE_DURATION_MS = 15000;

async function selectRoundContent(mode) {
  if (mode === "champion") {
    const champions = await championV2.findAll();
    const random = champions[Math.floor(Math.random() * champions.length)];
    return {
      answer: random.name,
      roundData: { championKey: random.championKey },
    };
  }

  if (mode === "splash") {
    const skins = await skinV2.findAll();
    const random = skins[Math.floor(Math.random() * skins.length)];
    const champ = await championV2.findById(random.championId);
    return {
      answer: champ.name,
      roundData: {
        championKey: champ.championKey,
        skinKey: random.key,
      },
    };
  }

  if (mode === "item") {
    const items = await itemV2.findAll();
    const random = items[Math.floor(Math.random() * items.length)];
    return {
      answer: random.name,
      roundData: { itemId: random.itemId },
    };
  }

  if (mode === "legacy_item") {
    const oldItems = await oldItemV2.findAll();
    const random = oldItems[Math.floor(Math.random() * oldItems.length)];
    return {
      answer: random.name,
      roundData: { oldItemKey: random.old_item_key },
    };
  }

  throw new Error(`Unknown mode: ${mode}`);
}

async function startGame(code) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };
  if (room.players.length < 2) return { error: "Need at least 2 players" };
  if (room.state !== "lobby") return { error: "Game already started" };

  room.state = "starting";
  room.currentRound = 0;
  room.players.forEach((p) => {
    p.score = 0;
  });
  await setRoom(code, room);
  return { room };
}

async function startRound(code) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };

  room.currentRound += 1;
  const modes = room.settings.gameModes;
  const mode = modes[Math.floor(Math.random() * modes.length)];

  const { answer, roundData } = await selectRoundContent(mode);

  room.currentMode = mode;
  room.currentAnswer = answer;
  room.currentRoundData = roundData;
  room.winnerId = null;
  room.state = "in_round";

  await setRoom(code, room);
  return { room, mode, roundData };
}

async function handleGuess(code, playerId, guess) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };
  if (room.state !== "in_round") return { error: "Not in round" };
  if (room.winnerId) return { correct: false };

  const correct =
    guess.trim().toLowerCase() === room.currentAnswer.trim().toLowerCase();
  if (!correct) return { correct: false };

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return { error: "Player not found" };

  room.winnerId = playerId;
  player.score += 1;
  room.state = "round_end";

  await setRoom(code, room);
  return {
    correct: true,
    winner: player,
    answer: room.currentAnswer,
    scores: room.players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      score: p.score,
    })),
  };
}

async function endRound(code) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };

  if (room.currentRound >= room.maxRounds) {
    room.state = "game_end";
    await setRoom(code, room);
    return { gameOver: true, room };
  }

  return { gameOver: false, room };
}

async function pauseGame(code, playerId) {
  const room = await getRoom(code);
  if (!room) return null;
  if (room.state !== "in_round") return null;

  room.state = "paused";
  room.pauseState = {
    isPaused: true,
    reason: "disconnect",
    resumeAt: Date.now() + PAUSE_DURATION_MS,
    disconnectedPlayerId: playerId,
  };

  const player = room.players.find((p) => p.id === playerId);
  if (player) player.isConnected = false;

  await setRoom(code, room);
  return room;
}

async function resumeGame(code) {
  const room = await getRoom(code);
  if (!room) return null;
  if (room.state !== "paused") return null;

  room.state = "in_round";
  room.pauseState = null;

  await setRoom(code, room);
  return room;
}

function getScoreboard(room) {
  return room.players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({
      rank: i + 1,
      id: p.id,
      nickname: p.nickname,
      score: p.score,
    }));
}

module.exports = {
  startGame,
  startRound,
  handleGuess,
  endRound,
  pauseGame,
  resumeGame,
  getScoreboard,
};
