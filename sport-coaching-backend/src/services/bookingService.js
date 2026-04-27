const AppError = require("../utils/AppError");
const bookingRepository = require("../repositories/bookingRepository");
const sessionRepository = require("../repositories/sessionRepository");

const bookingService = {
  async createBooking(user, sessionId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new AppError("Session not found", 404);
    }
    const alreadyBooked = await bookingRepository.findByUserAndSession(user.id, sessionId);
    if (alreadyBooked) {
      throw new AppError("Session already booked", 409);
    }
    const count = await bookingRepository.countSessionBookings(sessionId);
    if (count >= session.maxParticipants) {
      throw new AppError("Session is full", 409);
    }
    const conflict = await bookingRepository.findConflictingBooking(
      user.id,
      session.date,
      session.duration || 60
    );
    if (conflict) {
      throw new AppError("Cannot book two sessions in the same time slot", 409);
    }
    return bookingRepository.createBooking({ userId: user.id, sessionId });
  },

  async cancelBooking(user, sessionId) {
    const booking = await bookingRepository.findByUserAndSession(user.id, sessionId);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    return bookingRepository.deleteBooking({ userId_sessionId: { userId: user.id, sessionId } });
  },

  async listMyBookings(user) {
    return bookingRepository.listByUserId(user.id);
  }
};

module.exports = bookingService;
