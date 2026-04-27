const prisma = require("../config/db");

const bookingRepository = {
  createBooking(data) {
    return prisma.booking.create({ data });
  },
  deleteBooking(where) {
    return prisma.booking.delete({ where });
  },
  findByUserAndSession(userId, sessionId) {
    return prisma.booking.findUnique({
      where: { userId_sessionId: { userId, sessionId } }
    });
  },
  countSessionBookings(sessionId) {
    return prisma.booking.count({ where: { sessionId } });
  },
  findConflictingBooking(userId, date, duration = 60) {
    const start = new Date(date.getTime() - duration * 60 * 1000);
    const end = new Date(date.getTime() + duration * 60 * 1000);
    return prisma.booking.findFirst({
      where: {
        userId,
        session: { date: { gte: start, lte: end } }
      },
      include: { session: true }
    });
  },
  listByUserId(userId) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        session: {
          include: {
            coach: { include: { user: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
};

module.exports = bookingRepository;
