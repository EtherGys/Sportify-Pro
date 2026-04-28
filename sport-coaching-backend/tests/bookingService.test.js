const bookingService = require("../src/services/bookingService");
const bookingRepository = require("../src/repositories/bookingRepository");
const sessionRepository = require("../src/repositories/sessionRepository");
const AppError = require("../src/utils/AppError");

jest.mock("../src/repositories/bookingRepository", () => ({
  findByUserAndSession: jest.fn(),
  createBooking: jest.fn(),
  deleteBooking: jest.fn(),
  countSessionBookings: jest.fn(),
  findConflictingBooking: jest.fn(),
  listByUserId: jest.fn()
}));

jest.mock("../src/repositories/sessionRepository", () => ({
  findById: jest.fn()
}));

describe("bookingService.createBooking", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when session does not exist", async () => {
    sessionRepository.findById.mockResolvedValue(null);
    
    await expect(
      bookingService.createBooking({ id: 1 }, 999)
    ).rejects.toThrow("Session not found");
    
    expect(sessionRepository.findById).toHaveBeenCalledWith(999);
  });

  it("throws when user already booked the session", async () => {
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      maxParticipants: 10,
      duration: 60
    });
    bookingRepository.findByUserAndSession.mockResolvedValue({ id: 1 });

    await expect(
      bookingService.createBooking({ id: 1 }, 1)
    ).rejects.toThrow("Session already booked");
  });

  it("throws when session is full", async () => {
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      maxParticipants: 2,
      duration: 60
    });
    bookingRepository.findByUserAndSession.mockResolvedValue(null);
    bookingRepository.countSessionBookings.mockResolvedValue(2);

    await expect(
      bookingService.createBooking({ id: 1 }, 1)
    ).rejects.toThrow("Session is full");
  });

  it("throws when there is a time conflict", async () => {
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      maxParticipants: 10,
      date: new Date("2026-05-01T10:00:00"),
      duration: 60
    });
    bookingRepository.findByUserAndSession.mockResolvedValue(null);
    bookingRepository.countSessionBookings.mockResolvedValue(1);
    bookingRepository.findConflictingBooking.mockResolvedValue({ id: 2 });

    await expect(
      bookingService.createBooking({ id: 1 }, 1)
    ).rejects.toThrow("Cannot book two sessions in the same time slot");
  });

  it("creates booking successfully when all validations pass", async () => {
    const mockSession = {
      id: 1,
      maxParticipants: 10,
      date: new Date("2026-05-01T10:00:00"),
      duration: 60
    };
    const mockBooking = { userId: 1, sessionId: 1, id: 100 };

    sessionRepository.findById.mockResolvedValue(mockSession);
    bookingRepository.findByUserAndSession.mockResolvedValue(null);
    bookingRepository.countSessionBookings.mockResolvedValue(1);
    bookingRepository.findConflictingBooking.mockResolvedValue(null);
    bookingRepository.createBooking.mockResolvedValue(mockBooking);

    const result = await bookingService.createBooking({ id: 1 }, 1);

    expect(result).toEqual(mockBooking);
    expect(bookingRepository.createBooking).toHaveBeenCalledWith({ userId: 1, sessionId: 1 });
  });
});

describe("bookingService.cancelBooking", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when booking does not exist", async () => {
    bookingRepository.findByUserAndSession.mockResolvedValue(null);

    await expect(
      bookingService.cancelBooking({ id: 1 }, 1)
    ).rejects.toThrow("Booking not found");
  });

  it("cancels booking successfully", async () => {
    bookingRepository.findByUserAndSession.mockResolvedValue({ id: 1, userId: 1, sessionId: 1 });
    bookingRepository.deleteBooking.mockResolvedValue({ id: 1 });

    const result = await bookingService.cancelBooking({ id: 1 }, 1);

    expect(result).toEqual({ id: 1 });
    expect(bookingRepository.deleteBooking).toHaveBeenCalledWith({
      userId_sessionId: { userId: 1, sessionId: 1 }
    });
  });
});

describe("bookingService.listMyBookings", () => {
  it("lists all bookings for a user", async () => {
    const mockBookings = [
      { id: 1, userId: 1, sessionId: 1, session: { title: "Session 1" } },
      { id: 2, userId: 1, sessionId: 2, session: { title: "Session 2" } }
    ];
    bookingRepository.listByUserId.mockResolvedValue(mockBookings);

    const result = await bookingService.listMyBookings({ id: 1 });

    expect(result).toEqual(mockBookings);
    expect(bookingRepository.listByUserId).toHaveBeenCalledWith(1);
  });

  it("returns empty array when user has no bookings", async () => {
    bookingRepository.listByUserId.mockResolvedValue([]);

    const result = await bookingService.listMyBookings({ id: 999 });

    expect(result).toEqual([]);
  });
});
