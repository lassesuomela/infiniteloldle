const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const item = {
  async findById(id) {
    return prisma.items.findUnique({ where: { id } });
  },

  async findByItemId(itemId) {
    return prisma.items.findUnique({ where: { itemId } });
  },

  async findByName(name) {
    return prisma.items.findUnique({ where: { name } });
  },

  async findAll() {
    return prisma.items.findMany();
  },

  async findAllIds() {
    const items = await prisma.items.findMany({ select: { id: true } });
    return items.map((item) => item.id);
  },

  async findAllItemIds() {
    const items = await prisma.items.findMany({ select: { itemId: true } });
    return items.map((item) => item.itemId);
  },

  async findAllNames() {
    const items = await prisma.items.findMany({ select: { name: true } });
    return items.map((item) => item.name);
  },

  async create(data) {
    return prisma.items.create({ data });
  },

  async updateById(id, data) {
    return prisma.items.update({ where: { id }, data });
  },

  async updateByItemId(itemId, data) {
    return prisma.items.update({ where: { itemId }, data });
  },

  async deleteById(id) {
    return prisma.items.delete({ where: { id } });
  },

  async deleteByItemId(itemId) {
    return prisma.items.delete({ where: { itemId } });
  },
};

module.exports = item;
