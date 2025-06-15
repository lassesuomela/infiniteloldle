const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient();

const oldItem = {
  async findById(id) {
    return prisma.old_items.findUnique({ where: { id } });
  },

  async findByName(name) {
    return prisma.old_items.findUnique({ where: { name } });
  },

  async findByOldItemKey(oldItemKey) {
    return prisma.old_items.findFirst({ where: { old_item_key: oldItemKey } });
  },

  async findAll() {
    return prisma.old_items.findMany();
  },

  async findAllIds() {
    const items = await prisma.old_items.findMany({ select: { id: true } });
    return items.map((item) => item.id);
  },

  async findAllNames() {
    const items = await prisma.old_items.findMany({ select: { name: true } });
    return items.map((item) => item.name);
  },

  async create(data) {
    return prisma.old_items.create({ data });
  },

  async updateById(id, data) {
    return prisma.old_items.update({ where: { id }, data });
  },

  async updateByName(name, data) {
    return prisma.old_items.update({ where: { name }, data });
  },

  async deleteById(id) {
    return prisma.old_items.delete({ where: { id } });
  },
};

module.exports = oldItem;
