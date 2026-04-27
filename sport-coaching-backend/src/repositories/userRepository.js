const prisma = require("../config/db");

const userRepository = {
  createUser(data) {
    return prisma.user.create({ data, include: { role: true, coach: true, admin: true } });
  },
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email }, include: { role: true, coach: true, admin: true } });
  },
  findById(id) {
    return prisma.user.findUnique({ where: { id }, include: { role: true, coach: true, admin: true } });
  },
  listUsers() {
    return prisma.user.findMany({ include: { role: true, coach: true, admin: true } });
  },
  deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  }
};

module.exports = userRepository;
