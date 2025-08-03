const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const skin = {
  async findById(id) {
    return prisma.skins.findUnique({
      where: { id },
      include: {
        champion: true,
      },
    });
  },

  async findByName(name) {
    return prisma.skins.findUnique({ where: { name } });
  },

  async findByChampionId(championId) {
    return prisma.skins.findMany({ where: { championId } });
  },

  async findByChampionIdAndKey(championId, key) {
    return prisma.skins.findFirst({ where: { championId, key } });
  },

  async findAll() {
    return prisma.skins.findMany();
  },
};

module.exports = skin;
