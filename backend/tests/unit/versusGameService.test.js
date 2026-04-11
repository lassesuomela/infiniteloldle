jest.mock("../../versus/redis");
jest.mock("../../models/v2/champion");
jest.mock("../../models/v2/item");
jest.mock("../../models/v2/oldItem");
jest.mock("../../models/v2/skin");

const { getRoom, setRoom } = require("../../versus/redis");
const championV2 = require("../../models/v2/champion");
const itemV2 = require("../../models/v2/item");
const oldItemV2 = require("../../models/v2/oldItem");
const skinV2 = require("../../models/v2/skin");
const gameService = require("../../versus/gameService");

function makeRoom(overrides = {}) {
  return {
    code: "ABC123",
    hostId: "host1",
    players: [
      { id: "host1", nickname: "Host", score: 0, isConnected: true, joinedAt: 1000 },
      { id: "p2", nickname: "P2", score: 0, isConnected: true, joinedAt: 2000 },
    ],
    settings: {
      maxPlayers: 16,
      rounds: 3,
      gameModes: ["champion"],
      hintsEnabled: true,
    },
    state: "lobby",
    currentRound: 0,
    maxRounds: 3,
    currentAnswer: "",
    currentMode: "",
    currentRoundData: null,
    winnerId: null,
    pauseState: null,
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("Versus gameService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("startGame", () => {
    it("starts game successfully with 2 players", async () => {
      const room = makeRoom();
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await gameService.startGame("ABC123");

      expect(result.error).toBeUndefined();
      expect(result.room.state).toBe("starting");
    });

    it("returns error with fewer than 2 players", async () => {
      const room = makeRoom();
      room.players = [room.players[0]];
      getRoom.mockResolvedValue(room);

      const result = await gameService.startGame("ABC123");
      expect(result.error).toBe("Need at least 2 players");
    });

    it("returns error if room not found", async () => {
      getRoom.mockResolvedValue(null);
      const result = await gameService.startGame("NOROOM");
      expect(result.error).toBe("Room not found");
    });

    it("returns error if game already started", async () => {
      const room = makeRoom({ state: "in_round" });
      getRoom.mockResolvedValue(room);

      const result = await gameService.startGame("ABC123");
      expect(result.error).toBe("Game already started");
    });
  });

  describe("startRound", () => {
    it("starts a round with champion mode", async () => {
      const room = makeRoom({ state: "starting" });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);
      championV2.findAll.mockResolvedValue([
        { name: "Ahri", championKey: "Ahri" },
      ]);

      const result = await gameService.startRound("ABC123");

      expect(result.error).toBeUndefined();
      expect(result.mode).toBe("champion");
      expect(result.room.currentRound).toBe(1);
      expect(result.room.state).toBe("in_round");
      expect(result.room.currentAnswer).toBe("Ahri");
    });
  });

  describe("handleGuess", () => {
    it("registers correct guess", async () => {
      const room = makeRoom({ state: "in_round", currentAnswer: "Ahri" });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await gameService.handleGuess("ABC123", "p2", "Ahri");

      expect(result.correct).toBe(true);
      expect(result.winner.id).toBe("p2");
      expect(result.winner.score).toBe(1);
      expect(result.answer).toBe("Ahri");
    });

    it("case-insensitive matching", async () => {
      const room = makeRoom({ state: "in_round", currentAnswer: "Ahri" });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await gameService.handleGuess("ABC123", "p2", "ahri");

      expect(result.correct).toBe(true);
    });

    it("rejects wrong guess", async () => {
      const room = makeRoom({ state: "in_round", currentAnswer: "Ahri" });
      getRoom.mockResolvedValue(room);

      const result = await gameService.handleGuess("ABC123", "p2", "Zed");

      expect(result.correct).toBe(false);
    });

    it("returns error if not in round", async () => {
      const room = makeRoom({ state: "lobby" });
      getRoom.mockResolvedValue(room);

      const result = await gameService.handleGuess("ABC123", "p2", "Ahri");
      expect(result.error).toBe("Not in round");
    });
  });

  describe("endRound", () => {
    it("signals game over when all rounds done", async () => {
      const room = makeRoom({ state: "round_end", currentRound: 3, maxRounds: 3 });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await gameService.endRound("ABC123");

      expect(result.gameOver).toBe(true);
      expect(result.room.state).toBe("game_end");
    });

    it("continues game when rounds remain", async () => {
      const room = makeRoom({ state: "round_end", currentRound: 1, maxRounds: 3 });
      getRoom.mockResolvedValue(room);

      const result = await gameService.endRound("ABC123");

      expect(result.gameOver).toBe(false);
    });
  });

  describe("pauseGame", () => {
    it("pauses game during in_round state", async () => {
      const room = makeRoom({ state: "in_round" });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await gameService.pauseGame("ABC123", "p2");

      expect(result).not.toBeNull();
      expect(result.state).toBe("paused");
      expect(result.pauseState.disconnectedPlayerId).toBe("p2");
      expect(result.pauseState.reason).toBe("disconnect");
    });

    it("does not pause if not in_round", async () => {
      const room = makeRoom({ state: "lobby" });
      getRoom.mockResolvedValue(room);

      const result = await gameService.pauseGame("ABC123", "p2");
      expect(result).toBeNull();
    });
  });

  describe("resumeGame", () => {
    it("resumes paused game", async () => {
      const room = makeRoom({
        state: "paused",
        pauseState: { isPaused: true, reason: "disconnect", resumeAt: Date.now() + 10000, disconnectedPlayerId: "p2" },
      });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await gameService.resumeGame("ABC123");

      expect(result).not.toBeNull();
      expect(result.state).toBe("in_round");
      expect(result.pauseState).toBeNull();
    });

    it("returns null if not paused", async () => {
      const room = makeRoom({ state: "in_round" });
      getRoom.mockResolvedValue(room);

      const result = await gameService.resumeGame("ABC123");
      expect(result).toBeNull();
    });
  });

  describe("getScoreboard", () => {
    it("sorts players by score descending", () => {
      const room = makeRoom();
      room.players[0].score = 2;
      room.players[1].score = 5;

      const scoreboard = gameService.getScoreboard(room);

      expect(scoreboard[0].score).toBe(5);
      expect(scoreboard[0].rank).toBe(1);
      expect(scoreboard[1].score).toBe(2);
      expect(scoreboard[1].rank).toBe(2);
    });
  });
});
