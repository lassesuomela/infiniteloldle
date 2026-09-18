const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const user = {
  async findByToken(token) {
    return prisma.users.findFirst({ where: { token } });
  },

  async findById(id) {
    return prisma.users.findUnique({ where: { id } });
  },

  async create(data) {
    return prisma.users.create({ data });
  },

  async updateById(id, data) {
    return prisma.users.update({ where: { id }, data });
  },

  async updateByToken(token, data) {
    return prisma.users.update({ where: { token }, data });
  },

  async addSolvedChampion(userId, championId, guessCount = 0) {
    return prisma.userSolvedChampions.create({
      data: { userId, championId, guessCount },
    });
  },

  async addSolvedChampions(data) {
    return prisma.userSolvedChampions.createMany({
      data,
      skipDuplicates: true,
    });
  },

  async getSolvedChampionIds(userId) {
    const solved = await prisma.userSolvedChampions.findMany({
      where: { userId },
      select: { championId: true },
    });
    return solved.map((row) => row.championId);
  },

  async clearSolvedChampions(userId) {
    return prisma.userSolvedChampions.deleteMany({ where: { userId } });
  },

  async addSolvedSplash(userId, championId, guessCount = 0) {
    return prisma.userSolvedSplashes.create({
      data: { userId, championId, guessCount },
    });
  },

  async addSolvedSplashes(data) {
    return prisma.userSolvedSplashes.createMany({
      data,
      skipDuplicates: true,
    });
  },
  async getSolvedSplashChampionIds(userId) {
    const solved = await prisma.userSolvedSplashes.findMany({
      where: { userId },
      select: { championId: true },
    });
    return solved.map((row) => row.championId);
  },

  async clearSolvedSplashes(userId) {
    return prisma.userSolvedSplashes.deleteMany({ where: { userId } });
  },

  async addSolvedItem(userId, itemId, guessCount = 0) {
    return prisma.userSolvedItems.create({
      data: { userId, itemId, guessCount },
    });
  },

  async addSolvedItems(data) {
    return prisma.userSolvedItems.createMany({
      data,
      skipDuplicates: true,
    });
  },

  async getSolvedItemIds(userId) {
    const solved = await prisma.userSolvedItems.findMany({
      where: { userId },
      select: { itemId: true },
    });
    return solved.map((row) => row.itemId);
  },

  async clearSolvedItems(userId) {
    return prisma.userSolvedItems.deleteMany({ where: { userId } });
  },

  async addSolvedOldItem(userId, oldItemId, guessCount = 0) {
    return prisma.userSolvedOldItems.create({
      data: { userId, oldItemId, guessCount },
    });
  },

  async addSolvedOldItems(data) {
    return prisma.userSolvedOldItems.createMany({
      data,
      skipDuplicates: true,
    });
  },

  async getSolvedOldItemIds(userId) {
    const solved = await prisma.userSolvedOldItems.findMany({
      where: { userId },
      select: { oldItemId: true },
    });
    return solved.map((row) => row.oldItemId);
  },

  async clearSolvedOldItems(userId) {
    return prisma.userSolvedOldItems.deleteMany({ where: { userId } });
  },

  async findAll() {
    return prisma.users.findMany();
  },

  async getSolvedAbilityIds(userId) {
    const solved = await prisma.userSolvedAbilities.findMany({
      where: { userId },
      select: { abilityId: true },
    });
    return solved.map((row) => row.abilityId);
  },

  async addSolvedAbility(userId, abilityId, guessCount = 0) {
    return prisma.userSolvedAbilities.create({
      data: { userId, abilityId, guessCount },
    });
  },

  async addSolvedAbilities(data) {
    return prisma.userSolvedAbilities.createMany({
      data,
      skipDuplicates: true,
    });
  },

  async clearSolvedAbilities(userId) {
    return prisma.userSolvedAbilities.deleteMany({ where: { userId } });
  },
};

module.exports = user;
