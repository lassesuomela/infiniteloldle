const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const GameTypes = {
  champion: "champion",
  splash: "splash",
  item: "item",
  oldItem: "oldItem",
  ability: "ability",
};

const RoundStatuses = {
  inProgress: "in_progress",
  solved: "solved",
  gaveUp: "gave_up",
  abandoned: "abandoned",
};

const normalizeVariantId = (targetVariantId) =>
  targetVariantId === undefined ? null : targetVariantId;

const fetchLatestPatchVersion = async (db) => {
  const latestPatch = await db.lol_patches.findFirst({
    orderBy: { checkedAt: "desc" },
    select: { version: true },
  });
  return latestPatch?.version ?? null;
};

const gameTracking = {
  GameTypes,
  RoundStatuses,

  async startRound({
    userId,
    gameType,
    targetId,
    targetVariantId = null,
    patchVersion,
  }) {
    const normalizedVariantId = normalizeVariantId(targetVariantId);
    const existingRound = await prisma.gameRound.findFirst({
      where: {
        userId,
        gameType,
        targetId,
        targetVariantId: normalizedVariantId,
        status: RoundStatuses.inProgress,
      },
      orderBy: { startedAt: "desc" },
    });

    if (existingRound) {
      return existingRound;
    }

    const resolvedPatchVersion =
      patchVersion === undefined
        ? await fetchLatestPatchVersion(prisma)
        : patchVersion;

    return prisma.gameRound.create({
      data: {
        userId,
        gameType,
        targetId,
        targetVariantId: normalizedVariantId,
        patchVersion: resolvedPatchVersion,
      },
    });
  },

  async recordGuess({
    userId,
    gameType,
    targetId,
    targetVariantId = null,
    guessId,
    isCorrect,
    guessedAt = new Date(),
  }) {
    const normalizedVariantId = normalizeVariantId(targetVariantId);

    return prisma.$transaction(async (tx) => {
      let round = await tx.gameRound.findFirst({
        where: {
          userId,
          gameType,
          targetId,
          targetVariantId: normalizedVariantId,
          status: RoundStatuses.inProgress,
        },
        orderBy: { startedAt: "desc" },
      });

      if (!round) {
        const patchVersion = await fetchLatestPatchVersion(tx);
        round = await tx.gameRound.create({
          data: {
            userId,
            gameType,
            targetId,
            targetVariantId: normalizedVariantId,
            patchVersion,
          },
        });
      }

      const guessNumber = round.guessCount + 1;

      await tx.gameGuess.create({
        data: {
          gameRoundId: round.id,
          guessNumber,
          guessId,
          guessedAt,
          isCorrect,
        },
      });

      const updateData = {
        guessCount: guessNumber,
      };

      if (isCorrect) {
        updateData.status = RoundStatuses.solved;
        updateData.endedAt = guessedAt;
      }

      const updatedRound = await tx.gameRound.update({
        where: { id: round.id },
        data: updateData,
      });

      return {
        gameRound: updatedRound,
        guessNumber,
      };
    });
  },

  async markCurrentRoundAsGaveUp({ userId, gameType, endedAt = new Date() }) {
    const latestRound = await prisma.gameRound.findFirst({
      where: {
        userId,
        gameType,
        status: RoundStatuses.inProgress,
      },
      orderBy: { startedAt: "desc" },
    });

    if (!latestRound) {
      return null;
    }

    return prisma.gameRound.update({
      where: { id: latestRound.id },
      data: {
        status: RoundStatuses.gaveUp,
        endedAt,
      },
    });
  },

  async markAbandonedRounds({ now = new Date(), thresholdHours = 24 } = {}) {
    const cutoff = new Date(now.getTime() - thresholdHours * 60 * 60 * 1000);

    return prisma.gameRound.updateMany({
      where: {
        status: RoundStatuses.inProgress,
        updatedAt: { lt: cutoff },
      },
      data: {
        status: RoundStatuses.abandoned,
        endedAt: now,
      },
    });
  },
};

module.exports = gameTracking;
