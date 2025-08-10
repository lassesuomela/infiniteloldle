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

  async addSolvedChampion(userId, championId) {
    return prisma.userSolvedChampions.create({
      data: { userId, championId },
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

  async addSolvedSplash(userId, championId) {
    return prisma.userSolvedSplashes.create({
      data: { userId, championId },
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

  async addSolvedItem(userId, itemId) {
    return prisma.userSolvedItems.create({
      data: { userId, itemId },
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

  async addSolvedOldItem(userId, oldItemId) {
    return prisma.userSolvedOldItems.create({
      data: { userId, oldItemId },
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
      select: { championId: true },
    });
    return solved.map((row) => row.abilityId);
  },

  async addSolvedAbility(userId, abilityId) {
    return prisma.userSolvedAbilities.create({
      data: { userId, abilityId },
    });
  },

  async clearSolvedAbilities(userId) {
    return prisma.userSolvedAbilities.deleteMany({ where: { userId } });
  },
};

module.exports = user;
