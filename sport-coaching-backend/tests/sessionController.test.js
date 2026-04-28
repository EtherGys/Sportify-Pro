const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => {
  req.user = {
    id: 1,
    role: { name: "ADMIN" },
    admin: { id: 1 },
    coach: { id: 5 }  // Add coach for tests that need it
  };
  next();
});

jest.mock("../src/middlewares/roleMiddleware", () => (...roles) => (req, res, next) => {
  next();
});

jest.mock("../src/middlewares/validate", () => (schema) => (req, res, next) => {
  next();
});

jest.mock("../src/services/sessionService", () => ({
  listSessions: jest.fn().mockResolvedValue({ items: [], pagination: { page: 1, limit: 10, total: 0 } }),
  createSession: jest.fn().mockResolvedValue({ id: 1, title: "Test session" }),
  updateSession: jest.fn().mockResolvedValue({ id: 1, title: "Updated session" }),
  deleteSession: jest.fn().mockResolvedValue(undefined),
  listSessionParticipants: jest.fn().mockResolvedValue([]),
  assignCoach: jest.fn().mockResolvedValue({ id: 1, coachId: 2 }),
  listMySessions: jest.fn().mockResolvedValue([{ id: 1, title: "My Session" }])
}));

const sessionService = require("../src/services/sessionService");

describe("session routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/sessions returns sessions list", async () => {
    sessionService.listSessions.mockResolvedValue({
      items: [{ id: 1, title: "Session 1" }],
      pagination: { page: 1, limit: 10, total: 1 }
    });

    const response = await request(app).get("/api/sessions");
    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.pagination.total).toBe(1);
  });

  it("GET /api/sessions returns empty list when no sessions exist", async () => {
    sessionService.listSessions.mockResolvedValue({
      items: [],
      pagination: { page: 1, limit: 10, total: 0 }
    });

    const response = await request(app).get("/api/sessions");
    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.pagination.total).toBe(0);
  });

  it("POST /api/sessions creates new session", async () => {
    const newSession = { id: 2, title: "New Session", description: "Test" };
    sessionService.createSession.mockResolvedValue(newSession);

    const response = await request(app)
      .post("/api/sessions")
      .send({ title: "New Session", description: "Test" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newSession);
  });

  it("PATCH /api/sessions/:id updates session", async () => {
    const updatedSession = { id: 1, title: "Updated", description: "Updated desc" };
    sessionService.updateSession.mockResolvedValue(updatedSession);

    const response = await request(app)
      .patch("/api/sessions/1")
      .send({ title: "Updated", description: "Updated desc" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedSession);
  });

  it("DELETE /api/sessions/:id deletes session", async () => {
    sessionService.deleteSession.mockResolvedValue(undefined);

    const response = await request(app).delete("/api/sessions/1");

    expect(response.status).toBe(204);
  });

  it("GET /api/sessions/:id/participants returns participants list", async () => {
    const participants = [
      { bookingId: 1, userId: 2, email: "user1@test.com" },
      { bookingId: 2, userId: 3, email: "user2@test.com" }
    ];
    sessionService.listSessionParticipants.mockResolvedValue(participants);

    const response = await request(app).get("/api/sessions/1/participants");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(participants);
    expect(response.body).toHaveLength(2);
  });

  it("PATCH /api/sessions/:id/assign-coach assigns coach to session", async () => {
    const updatedSession = { id: 1, coachId: 3 };
    sessionService.assignCoach.mockResolvedValue(updatedSession);

    const response = await request(app)
      .patch("/api/sessions/1/assign-coach")
      .send({ coachId: 3 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedSession);
  });

  it("GET /api/sessions/mine returns coach's sessions", async () => {
    const mySessions = [
      { id: 1, title: "Session 1", coachId: 5 },
      { id: 2, title: "Session 2", coachId: 5 }
    ];
    sessionService.listMySessions.mockResolvedValue(mySessions);

    const response = await request(app).get("/api/sessions/mine");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mySessions);
    expect(response.body).toHaveLength(2);
  });

  it("handles createSession errors", async () => {
    sessionService.createSession.mockRejectedValue(new Error("Forbidden"));

    const response = await request(app)
      .post("/api/sessions")
      .send({ title: "Session" });

    expect(response.status).toBe(500);
  });

  it("handles updateSession errors", async () => {
    sessionService.updateSession.mockRejectedValue(new Error("Not found"));

    const response = await request(app)
      .patch("/api/sessions/999")
      .send({ title: "Updated" });

    expect(response.status).toBe(500);
  });
});
