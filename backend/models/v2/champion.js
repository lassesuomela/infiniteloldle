const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const champion = {
  async findById(id) {
    return prisma.champions.findUnique({ where: { id } });
  },

  async findByName(name) {
    return prisma.champions.findFirst({ where: { name } });
  },

  async findByKey(championKey) {
    return prisma.champions.findFirst({ where: { championKey } });
  },

  async findAll() {
    return prisma.champions.findMany();
  },

  async findAllIds() {
    const champs = await prisma.champions.findMany({ select: { id: true } });
    return champs.map((c) => c.id);
  },

  async findAllNamesAndKeys() {
    return prisma.champions.findMany({
      select: { name: true, championKey: true },
    });
  },

  async create(data) {
    return prisma.champions.create({ data });
  },

  async updateById(id, data) {
    return prisma.champions.update({ where: { id }, data });
  },

  async updateByName(name, data) {
    return prisma.champions.update({ where: { name }, data });
  },

  async deleteById(id) {
    return prisma.champions.delete({ where: { id } });
  },
};

module.exports = champion;
