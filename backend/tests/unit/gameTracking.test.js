const mockPrisma = {
  gameRound: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  gameGuess: {
    create: jest.fn(),
  },
  lol_patches: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

const gameTracking = require("../../models/v2/gameTracking");

describe("gameTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((callback) => callback(mockPrisma));
  });

  it("creates a round when no in-progress round exists", async () => {
    mockPrisma.gameRound.findFirst.mockResolvedValue(null);
    mockPrisma.lol_patches.findFirst.mockResolvedValue({ version: "15.1" });
    mockPrisma.gameRound.create.mockResolvedValue({ id: 1 });

    await gameTracking.startRound({
      userId: 1,
      gameType: gameTracking.GameTypes.champion,
      targetId: 10,
    });

    expect(mockPrisma.gameRound.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        gameType: "champion",
        targetId: 10,
        targetVariantId: null,
        patchVersion: "15.1",
      },
    });
  });

  it("records sequential guesses and updates guessCount", async () => {
    mockPrisma.gameRound.findFirst
      .mockResolvedValueOnce({ id: 11, guessCount: 0 })
      .mockResolvedValueOnce({ id: 11, guessCount: 1 });
    mockPrisma.gameRound.update.mockResolvedValue({ id: 11, guessCount: 2 });

    await gameTracking.recordGuess({
      userId: 2,
      gameType: gameTracking.GameTypes.item,
      targetId: 2001,
      guessId: 3001,
      isCorrect: false,
    });

    await gameTracking.recordGuess({
      userId: 2,
      gameType: gameTracking.GameTypes.item,
      targetId: 2001,
      guessId: 3002,
      isCorrect: false,
    });

    expect(mockPrisma.gameGuess.create).toHaveBeenNthCalledWith(1, {
      data: {
        gameRoundId: 11,
        guessNumber: 1,
        guessId: 3001,
        guessedAt: expect.any(Date),
        isCorrect: false,
      },
    });
    expect(mockPrisma.gameGuess.create).toHaveBeenNthCalledWith(2, {
      data: {
        gameRoundId: 11,
        guessNumber: 2,
        guessId: 3002,
        guessedAt: expect.any(Date),
        isCorrect: false,
      },
    });
    expect(mockPrisma.gameRound.update).toHaveBeenNthCalledWith(2, {
      where: { id: 11 },
      data: { guessCount: 2 },
    });
  });

  it("marks round solved on a correct guess", async () => {
    mockPrisma.gameRound.findFirst.mockResolvedValue({ id: 21, guessCount: 2 });
    mockPrisma.gameRound.update.mockResolvedValue({ id: 21, guessCount: 3 });

    await gameTracking.recordGuess({
      userId: 3,
      gameType: gameTracking.GameTypes.ability,
      targetId: 77,
      guessId: 1,
      isCorrect: true,
    });

    expect(mockPrisma.gameRound.update).toHaveBeenCalledWith({
      where: { id: 21 },
      data: {
        guessCount: 3,
        status: gameTracking.RoundStatuses.solved,
        endedAt: expect.any(Date),
      },
    });
  });

  it("marks in-progress rounds as gave_up and abandoned", async () => {
    mockPrisma.gameRound.findFirst.mockResolvedValue({ id: 31 });
    mockPrisma.gameRound.update.mockResolvedValue({ id: 31 });
    mockPrisma.gameRound.updateMany.mockResolvedValue({ count: 5 });

    await gameTracking.markCurrentRoundAsGaveUp({
      userId: 4,
      gameType: gameTracking.GameTypes.splash,
    });
    await gameTracking.markAbandonedRounds({
      now: new Date("2026-01-02T00:00:00.000Z"),
      thresholdHours: 24,
    });

    expect(mockPrisma.gameRound.update).toHaveBeenCalledWith({
      where: { id: 31 },
      data: {
        status: gameTracking.RoundStatuses.gaveUp,
        endedAt: expect.any(Date),
      },
    });
    expect(mockPrisma.gameRound.updateMany).toHaveBeenCalledWith({
      where: {
        status: gameTracking.RoundStatuses.inProgress,
        updatedAt: { lt: new Date("2026-01-01T00:00:00.000Z") },
      },
      data: {
        status: gameTracking.RoundStatuses.abandoned,
        endedAt: new Date("2026-01-02T00:00:00.000Z"),
      },
    });
  });
});
