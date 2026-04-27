const prisma = require("../config/db");

const sessionRepository = {
  createSession(data) {
    return prisma.session.create({ data });
  },
  updateSession(id, data) {
    return prisma.session.update({ where: { id }, data });
  },
  deleteSession(id) {
    return prisma.session.delete({ where: { id } });
  },
  findById(id) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        coach: { include: { user: true } },
        bookings: { include: { user: true } }
      }
    });
  },
  listByCoachId(id) {
    console.log("id", id);
    
    return prisma.session.findMany({
      where: { coachId: id },
      orderBy: { createdAt: "desc" }
    });
  },
  searchSessions({ q, page, limit }) {
    return prisma.session.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } }
            ]
          }
        : {},
      include: { coach: { include: { user: true } }, bookings: true },
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit
    });
  },
  countSessions(q) {
    return prisma.session.count({
      where: q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } }
            ]
          }
        : {}
    });
  }
};

module.exports = sessionRepository;
