const prisma = require("../config/db");
const AppError = require("../utils/AppError");
const sessionRepository = require("../repositories/sessionRepository");

const sessionService = {
  async createSession(currentUser, payload) {
    if (currentUser.role.name === "COACH") {
      if (!currentUser.coach) {
        throw new AppError("Coach profile not found", 400);
      }
      return sessionRepository.createSession({ ...payload, coachId: currentUser.coach.id });
    }
    if (currentUser.role.name === "ADMIN") {
      if (!payload.coachId) {
        throw new AppError("coachId is required for admin", 400);
      }
      return sessionRepository.createSession(payload);
    }
    throw new AppError("Forbidden", 403);
  },

  async listSessions(query) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const q = query.search || "";
    const [items, total] = await Promise.all([
      sessionRepository.searchSessions({ q, page, limit }),
      sessionRepository.countSessions(q)
    ]);
    return { items, pagination: { page, limit, total } };
  },

  async updateSession(currentUser, sessionId, payload) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new AppError("Session not found", 404);
    }
    if (currentUser.role.name === "COACH" && session.coachId !== currentUser.coach?.id) {
      throw new AppError("You can only update your own sessions", 403);
    }
    if (currentUser.role.name !== "COACH" && currentUser.role.name !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }
    if (currentUser.role.name === "COACH" && payload.coachId) {
      throw new AppError("Coach cannot reassign session coach", 403);
    }
    return sessionRepository.updateSession(sessionId, payload);
  },

  async deleteSession(currentUser, sessionId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new AppError("Session not found", 404);
    }
    if (currentUser.role.name === "COACH" && session.coachId !== currentUser.coach?.id) {
      throw new AppError("You can only delete your own sessions", 403);
    }
    if (currentUser.role.name !== "COACH" && currentUser.role.name !== "ADMIN") {
      throw new AppError("Forbidden", 403);
    }
    return sessionRepository.deleteSession(sessionId);
  },

  async listSessionParticipants(currentUser, sessionId) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new AppError("Session not found", 404);
    }
    if (currentUser.role.name === "COACH" && session.coachId !== currentUser.coach?.id) {
      throw new AppError("You can only view participants of your sessions", 403);
    }
    if (currentUser.role.name === "CLIENT") {
      throw new AppError("Forbidden", 403);
    }
    return session.bookings.map((booking) => ({
      bookingId: booking.id,
      userId: booking.userId,
      email: booking.user.email
    }));
  },

  async assignCoach(sessionId, coachId) {
    const coach = await prisma.coach.findUnique({ where: { id: coachId } });
    if (!coach) {
      throw new AppError("Coach not found", 404);
    }
    return sessionRepository.updateSession(sessionId, { coachId });
  },
    async listMySessions(coachId) {
    return sessionRepository.listByCoachId(coachId);
  }
};

module.exports = sessionService;
