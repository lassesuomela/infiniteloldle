const { getRoom, setRoom } = require("./redis");
const championV2 = require("../models/v2/champion");
const itemV2 = require("../models/v2/item");
const oldItemV2 = require("../models/v2/oldItem");
const skinV2 = require("../models/v2/skin");
const abilityV2 = require("../models/v2/ability");
const { GetPartialSimilarites } = require("../helpers/compare");
const fsp = require("fs").promises;
const path = require("path");

const PAUSE_DURATION_MS = 15000;

const SPLASH_DIR = path.resolve(__dirname, "../images/champions/splash");
const ABILITIES_DIR = path.resolve(__dirname, "../images/champions/abilities");
const OLD_ITEMS_DIR = path.resolve(__dirname, "../old_items");

async function loadImageBase64(filePath) {
  try {
    const buf = await fsp.readFile(filePath);
    return buf.toString("base64");
  } catch {
    return null;
  }
}

async function selectRoundContent(mode) {
  if (mode === "champion") {
    const champions = await championV2.findAll();
    const random = champions[Math.floor(Math.random() * champions.length)];
    return {
      answer: random.name,
      imageBase64: null,
      // Store full champion for server-side comparison, never sent to client
      serverData: { champion: random },
      roundData: {},
    };
  }

  if (mode === "splash") {
    const skins = await skinV2.findAll();
    const random = skins[Math.floor(Math.random() * skins.length)];
    const champ = await championV2.findById(random.championId);
    const imageName = `${champ.championKey}_${random.key}.webp`;
    const imageBase64 = await loadImageBase64(path.join(SPLASH_DIR, imageName));
    return {
      answer: champ.name,
      imageBase64,
      serverData: {},
      roundData: {},
    };
  }

  if (mode === "item") {
    const items = await itemV2.findAll();
    const random = items[Math.floor(Math.random() * items.length)];
    // Item images are served as static files from frontend; send itemId so client can load image
    // itemId alone does not reveal the item name (users must still guess by name)
    return {
      answer: random.name,
      imageBase64: null,
      serverData: {},
      roundData: { itemId: random.itemId },
    };
  }

  if (mode === "legacy_item") {
    const oldItems = await oldItemV2.findAll();
    const random = oldItems[Math.floor(Math.random() * oldItems.length)];
    const imageName = `${random.old_item_key}.webp`;
    const imageBase64 = await loadImageBase64(
      path.join(OLD_ITEMS_DIR, imageName),
    );
    return {
      answer: random.name,
      imageBase64,
      serverData: {},
      roundData: {},
    };
  }

  if (mode === "ability") {
    const abilities = await abilityV2.findAll();
    const random = abilities[Math.floor(Math.random() * abilities.length)];
    const champ = await championV2.findById(random.championId);
    const imageName = `${champ.championKey}_${random.key}.webp`;
    const imageBase64 = await loadImageBase64(
      path.join(ABILITIES_DIR, imageName),
    );
    return {
      answer: champ.name,
      imageBase64,
      serverData: {},
      roundData: {},
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

  const { answer, imageBase64, serverData, roundData } =
    await selectRoundContent(mode);

  room.currentMode = mode;
  room.currentAnswer = answer;
  room.currentRoundData = roundData;
  room.currentServerData = serverData;
  room.winnerId = null;
  room.state = "in_round";

  await setRoom(code, room);
  return { room, mode, roundData, imageBase64 };
}

function computeChampionComparison(guessedChampion, correctChampion) {
  return {
    sameResource: guessedChampion.resource === correctChampion.resource,
    sameGender: guessedChampion.gender === correctChampion.gender,
    sameReleaseYear:
      correctChampion.released === guessedChampion.released
        ? "="
        : correctChampion.released > guessedChampion.released
          ? ">"
          : "<",
    samePosition: GetPartialSimilarites(
      guessedChampion.position,
      correctChampion.position,
    ),
    sameRangeType: GetPartialSimilarites(
      guessedChampion.rangeType,
      correctChampion.rangeType,
    ),
    sameRegion: GetPartialSimilarites(
      guessedChampion.region,
      correctChampion.region,
    ),
    sameGenre: GetPartialSimilarites(
      guessedChampion.genre,
      correctChampion.genre,
    ),
    sameDamageType: GetPartialSimilarites(
      guessedChampion.damageType,
      correctChampion.damageType,
    ),
  };
}

async function handleGuess(code, playerId, guess) {
  const room = await getRoom(code);
  if (!room) return { error: "Room not found" };
  if (room.state !== "in_round") return { error: "Not in round" };
  if (room.winnerId) return { correct: false };

  const correct =
    guess.trim().toLowerCase() === room.currentAnswer.trim().toLowerCase();

  if (!correct) {
    // For champion mode, return comparison data so the guesser can see feedback
    if (room.currentMode === "champion") {
      const correctChampion = room.currentServerData?.champion;
      const guessedChampion = await championV2.findByName(guess);
      if (guessedChampion && correctChampion) {
        const similarities = computeChampionComparison(
          guessedChampion,
          correctChampion,
        );
        return {
          correct: false,
          guessData: {
            champData: {
              guessedChampion: guessedChampion.name,
              championKey: guessedChampion.championKey,
              resource: guessedChampion.resource,
              gender: guessedChampion.gender,
              position: guessedChampion.position,
              rangeType: guessedChampion.rangeType,
              region: guessedChampion.region,
              releaseYear: guessedChampion.released,
              genre: guessedChampion.genre,
              damageType: guessedChampion.damageType,
            },
            similarities,
          },
        };
      }
    }
    return { correct: false };
  }

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
  if (room.pauseState?.isPaused) return room;
  if (room.pauseState?.disconnectedPlayerId === playerId) return room;

  const now = Date.now();

  room.state = "paused";
  room.pauseState = {
    isPaused: true,
    reason: "disconnect",
    pausedAt: now,
    resumeAt: now + PAUSE_DURATION_MS,
    duration: PAUSE_DURATION_MS,
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
