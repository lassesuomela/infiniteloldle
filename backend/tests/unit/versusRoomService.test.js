jest.mock("../../versus/redis");

const { getRoom, setRoom, deleteRoom } = require("../../versus/redis");
const roomService = require("../../versus/roomService");

describe("Versus roomService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createRoom", () => {
    it("creates a room with default settings", () => {
      const room = roomService.createRoom("socket1", "TestPlayer");

      expect(room.hostId).toBe("socket1");
      expect(room.players).toHaveLength(1);
      expect(room.players[0].nickname).toBe("TestPlayer");
      expect(room.players[0].id).toBe("socket1");
      expect(room.state).toBe("lobby");
      expect(room.code).toHaveLength(6);
      expect(room.settings.maxPlayers).toBe(16);
      expect(room.settings.rounds).toBe(10);
      expect(room.settings.gameModes).toEqual([
        "champion",
        "splash",
        "item",
        "legacy_item",
      ]);
    });

    it("creates a room with custom settings", () => {
      const settings = {
        maxPlayers: 4,
        rounds: 5,
        gameModes: ["champion"],
        hintsEnabled: false,
      };
      const room = roomService.createRoom("socket1", "Host", settings);

      expect(room.settings.maxPlayers).toBe(4);
      expect(room.settings.rounds).toBe(5);
      expect(room.settings.gameModes).toEqual(["champion"]);
      expect(room.settings.hintsEnabled).toBe(false);
    });
  });

  describe("addPlayer", () => {
    it("adds a player to a lobby room", async () => {
      const existingRoom = roomService.createRoom("host1", "Host");
      getRoom.mockResolvedValue(existingRoom);
      setRoom.mockResolvedValue(undefined);

      const result = await roomService.addPlayer(
        existingRoom.code,
        "player2",
        "Player2"
      );

      expect(result.error).toBeUndefined();
      expect(result.room.players).toHaveLength(2);
      expect(result.player.nickname).toBe("Player2");
    });

    it("returns error if room not found", async () => {
      getRoom.mockResolvedValue(null);

      const result = await roomService.addPlayer("NOROOM", "player2", "P2");
      expect(result.error).toBe("Room not found");
    });

    it("returns error if game already started", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.state = "in_round";
      getRoom.mockResolvedValue(room);

      const result = await roomService.addPlayer(room.code, "p2", "P2");
      expect(result.error).toBe("Game already started");
    });

    it("returns error if room is full", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.settings.maxPlayers = 1;
      getRoom.mockResolvedValue(room);

      const result = await roomService.addPlayer(room.code, "p2", "P2");
      expect(result.error).toBe("Room is full");
    });

    it("returns error if player already in room", async () => {
      const room = roomService.createRoom("host1", "Host");
      getRoom.mockResolvedValue(room);

      const result = await roomService.addPlayer(room.code, "host1", "Host");
      expect(result.error).toBe("Already in room");
    });
  });

  describe("removePlayer", () => {
    it("removes a non-host player", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 0, isConnected: true, joinedAt: Date.now() });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await roomService.removePlayer(room.code, "p2");

      expect(result.deleted).toBeUndefined();
      expect(result.room.players).toHaveLength(1);
      expect(result.hostChanged).toBe(false);
    });

    it("transfers host when host leaves", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 0, isConnected: true, joinedAt: Date.now() + 100 });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await roomService.removePlayer(room.code, "host1");

      expect(result.deleted).toBeUndefined();
      expect(result.hostChanged).toBe(true);
      expect(result.room.hostId).toBe("p2");
    });

    it("deletes room when last player leaves", async () => {
      const room = roomService.createRoom("host1", "Host");
      getRoom.mockResolvedValue(room);
      deleteRoom.mockResolvedValue(undefined);

      const result = await roomService.removePlayer(room.code, "host1");

      expect(result.deleted).toBe(true);
      expect(deleteRoom).toHaveBeenCalledWith(room.code);
    });

    it("returns null if room not found", async () => {
      getRoom.mockResolvedValue(null);
      const result = await roomService.removePlayer("NOROOM", "p1");
      expect(result).toBeNull();
    });
  });

  describe("kickPlayer", () => {
    it("kicks a player successfully", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 0, isConnected: true, joinedAt: Date.now() });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await roomService.kickPlayer(room.code, "host1", "p2");

      expect(result.error).toBeUndefined();
      expect(result.kicked.id).toBe("p2");
      expect(result.room.players).toHaveLength(1);
    });

    it("returns error if not host", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 0, isConnected: true, joinedAt: Date.now() });
      getRoom.mockResolvedValue(room);

      const result = await roomService.kickPlayer(room.code, "p2", "host1");
      expect(result.error).toBe("Only host can kick players");
    });

    it("returns error if not in lobby", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 0, isConnected: true, joinedAt: Date.now() });
      room.state = "in_round";
      getRoom.mockResolvedValue(room);

      const result = await roomService.kickPlayer(room.code, "host1", "p2");
      expect(result.error).toBe("Can only kick in lobby");
    });
  });

  describe("reconnectPlayer", () => {
    it("marks player as connected", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 2, isConnected: false, joinedAt: Date.now() });
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await roomService.reconnectPlayer(room.code, "p2");

      expect(result.error).toBeUndefined();
      expect(result.player.isConnected).toBe(true);
      expect(result.resumed).toBe(false);
    });

    it("resumes paused game when disconnected player reconnects", async () => {
      const room = roomService.createRoom("host1", "Host");
      room.players.push({ id: "p2", nickname: "P2", score: 0, isConnected: false, joinedAt: Date.now() });
      room.state = "paused";
      room.pauseState = { isPaused: true, reason: "disconnect", resumeAt: Date.now() + 10000, disconnectedPlayerId: "p2" };
      getRoom.mockResolvedValue(room);
      setRoom.mockResolvedValue(undefined);

      const result = await roomService.reconnectPlayer(room.code, "p2");

      expect(result.resumed).toBe(true);
      expect(result.room.state).toBe("in_round");
      expect(result.room.pauseState).toBeNull();
    });

    it("returns error if room not found", async () => {
      getRoom.mockResolvedValue(null);
      const result = await roomService.reconnectPlayer("NOROOM", "p1");
      expect(result.error).toBe("Room not found");
    });

    it("returns error if player not found in room", async () => {
      const room = roomService.createRoom("host1", "Host");
      getRoom.mockResolvedValue(room);

      const result = await roomService.reconnectPlayer(room.code, "unknown");
      expect(result.error).toBe("Player not found in room");
    });
  });
});
