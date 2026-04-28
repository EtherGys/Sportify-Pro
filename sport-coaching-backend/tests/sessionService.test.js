const sessionService = require("../src/services/sessionService");
const sessionRepository = require("../src/repositories/sessionRepository");
const prisma = require("../src/config/db");
const AppError = require("../src/utils/AppError");

jest.mock("../src/repositories/sessionRepository", () => ({
  findById: jest.fn(),
  createSession: jest.fn(),
  updateSession: jest.fn(),
  deleteSession: jest.fn(),
  searchSessions: jest.fn(),
  countSessions: jest.fn(),
  listByCoachId: jest.fn()
}));

jest.mock("../src/config/db", () => ({
  coach: { findUnique: jest.fn() }
}));

describe("sessionService.createSession", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when coach tries to create session without coach profile", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: null
    };

    await expect(
      sessionService.createSession(currentUser, { title: "Session" })
    ).rejects.toThrow("Coach profile not found");
  });

  it("creates session as coach with coach ID", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    const payload = { title: "Yoga Session", description: "Relaxing yoga" };
    const mockSession = { id: 1, coachId: 5, ...payload };

    sessionRepository.createSession.mockResolvedValue(mockSession);

    const result = await sessionService.createSession(currentUser, payload);

    expect(result).toEqual(mockSession);
    expect(sessionRepository.createSession).toHaveBeenCalledWith({
      ...payload,
      coachId: 5
    });
  });

  it("throws when admin creates session without coachId", async () => {
    const currentUser = {
      id: 1,
      role: { name: "ADMIN" },
      admin: { id: 1 }
    };

    await expect(
      sessionService.createSession(currentUser, { title: "Session" })
    ).rejects.toThrow("coachId is required for admin");
  });

  it("creates session as admin with provided coachId", async () => {
    const currentUser = {
      id: 1,
      role: { name: "ADMIN" },
      admin: { id: 1 }
    };
    const payload = { title: "Boxing", description: "Boxing lessons", coachId: 3 };
    const mockSession = { id: 1, ...payload };

    sessionRepository.createSession.mockResolvedValue(mockSession);

    const result = await sessionService.createSession(currentUser, payload);

    expect(result).toEqual(mockSession);
    expect(sessionRepository.createSession).toHaveBeenCalledWith(payload);
  });

  it("throws when client tries to create session", async () => {
    const currentUser = {
      id: 1,
      role: { name: "CLIENT" }
    };

    await expect(
      sessionService.createSession(currentUser, { title: "Session" })
    ).rejects.toThrow("Forbidden");
  });
});

describe("sessionService.listSessions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns sessions with default pagination", async () => {
    const mockSessions = [
      { id: 1, title: "Session 1" },
      { id: 2, title: "Session 2" }
    ];
    sessionRepository.searchSessions.mockResolvedValue(mockSessions);
    sessionRepository.countSessions.mockResolvedValue(2);

    const result = await sessionService.listSessions({});

    expect(result).toEqual({
      items: mockSessions,
      pagination: { page: 1, limit: 10, total: 2 }
    });
    expect(sessionRepository.searchSessions).toHaveBeenCalledWith({
      q: "",
      page: 1,
      limit: 10
    });
  });

  it("searches sessions with query parameter", async () => {
    const mockSessions = [{ id: 1, title: "Yoga" }];
    sessionRepository.searchSessions.mockResolvedValue(mockSessions);
    sessionRepository.countSessions.mockResolvedValue(1);

    const result = await sessionService.listSessions({
      search: "yoga",
      page: 2,
      limit: 5
    });

    expect(result).toEqual({
      items: mockSessions,
      pagination: { page: 2, limit: 5, total: 1 }
    });
    expect(sessionRepository.searchSessions).toHaveBeenCalledWith({
      q: "yoga",
      page: 2,
      limit: 5
    });
  });
});

describe("sessionService.updateSession", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when session does not exist", async () => {
    sessionRepository.findById.mockResolvedValue(null);

    await expect(
      sessionService.updateSession(
        { id: 1, role: { name: "ADMIN" } },
        999,
        { title: "Updated" }
      )
    ).rejects.toThrow("Session not found");
  });

  it("throws when coach tries to update someone else's session", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 3,
      title: "Existing"
    });

    await expect(
      sessionService.updateSession(currentUser, 1, { title: "Updated" })
    ).rejects.toThrow("You can only update your own sessions");
  });

  it("throws when coach tries to reassign coach", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 5,
      title: "Existing"
    });

    await expect(
      sessionService.updateSession(currentUser, 1, { coachId: 3 })
    ).rejects.toThrow("Coach cannot reassign session coach");
  });

  it("updates session as admin", async () => {
    const currentUser = {
      id: 1,
      role: { name: "ADMIN" }
    };
    const updatedSession = { id: 1, title: "Updated", coachId: 3 };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 5,
      title: "Old"
    });
    sessionRepository.updateSession.mockResolvedValue(updatedSession);

    const result = await sessionService.updateSession(currentUser, 1, {
      title: "Updated"
    });

    expect(result).toEqual(updatedSession);
    expect(sessionRepository.updateSession).toHaveBeenCalledWith(1, {
      title: "Updated"
    });
  });

  it("updates coach's own session", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    const updatedSession = { id: 1, title: "Updated", coachId: 5 };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 5,
      title: "Old"
    });
    sessionRepository.updateSession.mockResolvedValue(updatedSession);

    const result = await sessionService.updateSession(currentUser, 1, {
      title: "Updated"
    });

    expect(result).toEqual(updatedSession);
  });
});

describe("sessionService.deleteSession", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when session does not exist", async () => {
    sessionRepository.findById.mockResolvedValue(null);

    await expect(
      sessionService.deleteSession(
        { id: 1, role: { name: "ADMIN" } },
        999
      )
    ).rejects.toThrow("Session not found");
  });

  it("throws when coach tries to delete someone else's session", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 3
    });

    await expect(
      sessionService.deleteSession(currentUser, 1)
    ).rejects.toThrow("You can only delete your own sessions");
  });

  it("deletes session as admin", async () => {
    const currentUser = {
      id: 1,
      role: { name: "ADMIN" }
    };
    sessionRepository.findById.mockResolvedValue({ id: 1, coachId: 5 });
    sessionRepository.deleteSession.mockResolvedValue({ id: 1 });

    const result = await sessionService.deleteSession(currentUser, 1);

    expect(result).toEqual({ id: 1 });
    expect(sessionRepository.deleteSession).toHaveBeenCalledWith(1);
  });

  it("deletes coach's own session", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    sessionRepository.findById.mockResolvedValue({ id: 1, coachId: 5 });
    sessionRepository.deleteSession.mockResolvedValue({ id: 1 });

    const result = await sessionService.deleteSession(currentUser, 1);

    expect(result).toEqual({ id: 1 });
  });
});

describe("sessionService.listSessionParticipants", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when session does not exist", async () => {
    sessionRepository.findById.mockResolvedValue(null);

    await expect(
      sessionService.listSessionParticipants(
        { id: 1, role: { name: "ADMIN" } },
        999
      )
    ).rejects.toThrow("Session not found");
  });

  it("throws when client tries to view participants", async () => {
    const currentUser = {
      id: 1,
      role: { name: "CLIENT" }
    };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 1,
      bookings: []
    });

    await expect(
      sessionService.listSessionParticipants(currentUser, 1)
    ).rejects.toThrow("Forbidden");
  });

  it("returns participants for coach's own session", async () => {
    const currentUser = {
      id: 1,
      role: { name: "COACH" },
      coach: { id: 5 }
    };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 5,
      bookings: [
        { id: 1, userId: 2, user: { email: "user1@test.com" } },
        { id: 2, userId: 3, user: { email: "user2@test.com" } }
      ]
    });

    const result = await sessionService.listSessionParticipants(currentUser, 1);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      bookingId: 1,
      userId: 2,
      email: "user1@test.com"
    });
  });

  it("returns participants for admin", async () => {
    const currentUser = {
      id: 1,
      role: { name: "ADMIN" }
    };
    sessionRepository.findById.mockResolvedValue({
      id: 1,
      coachId: 5,
      bookings: [
        { id: 1, userId: 2, user: { email: "user1@test.com" } }
      ]
    });

    const result = await sessionService.listSessionParticipants(currentUser, 1);

    expect(result).toHaveLength(1);
  });
});

describe("sessionService.assignCoach", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when coach does not exist", async () => {
    prisma.coach.findUnique.mockResolvedValue(null);

    await expect(sessionService.assignCoach(1, 999)).rejects.toThrow(
      "Coach not found"
    );
  });

  it("assigns coach to session", async () => {
    prisma.coach.findUnique.mockResolvedValue({ id: 5, userId: 3 });
    sessionRepository.updateSession.mockResolvedValue({
      id: 1,
      coachId: 5
    });

    const result = await sessionService.assignCoach(1, 5);

    expect(result).toEqual({ id: 1, coachId: 5 });
    expect(sessionRepository.updateSession).toHaveBeenCalledWith(1, {
      coachId: 5
    });
  });
});

describe("sessionService.listMySessions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns sessions for a coach", async () => {
    const mockSessions = [
      { id: 1, title: "Session 1", coachId: 5 },
      { id: 2, title: "Session 2", coachId: 5 }
    ];
    sessionRepository.listByCoachId.mockResolvedValue(mockSessions);

    const result = await sessionService.listMySessions(5);

    expect(result).toEqual(mockSessions);
    expect(sessionRepository.listByCoachId).toHaveBeenCalledWith(5);
  });

  it("returns empty array when coach has no sessions", async () => {
    sessionRepository.listByCoachId.mockResolvedValue([]);

    const result = await sessionService.listMySessions(999);

    expect(result).toEqual([]);
  });
});
