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
  async deleteUser(id) {
    await prisma.coach.deleteMany({ where: { userId: id } });
    await prisma.admin.deleteMany({ where: { userId: id } });
    return prisma.user.delete({ where: { id } });
  },
  updateUser(id, email, role) {
    return prisma.user.update({
      where: { id },
      data: {
        email,
        role,
      },
    });
  }
};

module.exports = userRepository;
