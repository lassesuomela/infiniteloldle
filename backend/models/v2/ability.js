const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const ability = {
  async findById(id) {
    return prisma.abilities.findUnique({
      where: { id },
      include: {
        champion: true,
      },
    });
  },

  async findByName(name) {
    return prisma.abilities.findUnique({ where: { name } });
  },

  async findByChampionId(championId) {
    return prisma.abilities.findMany({ where: { championId } });
  },

  async findByChampionIdAndKey(championId, key) {
    return prisma.abilities.findFirst({ where: { championId, key } });
  },

  async findAll() {
    return prisma.abilities.findMany();
  },

  async findAllIds() {
    const abilities = await prisma.abilities.findMany({
      select: { id: true },
    });
    return abilities.map((a) => a.id);
  },

  async findByChampionName(championName) {
    const champion = await prisma.champions.findUnique({
      where: { name: championName },
    });

    if (!champion) {
      return null;
    }

    return prisma.abilities.findMany({
      where: { championId: champion.id },
    });
  },
};

module.exports = ability;
