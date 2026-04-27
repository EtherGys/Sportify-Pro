const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => {
  req.user = { role: { name: "ADMIN" }, admin: { id: 1 } };
  next();
});

jest.mock("../src/services/sessionService", () => ({
  listSessions: jest.fn().mockResolvedValue({ items: [], pagination: { page: 1, limit: 10, total: 0 } }),
  createSession: jest.fn().mockResolvedValue({ id: 1, title: "Test session" }),
  updateSession: jest.fn().mockResolvedValue({ id: 1, title: "Updated session" }),
  deleteSession: jest.fn().mockResolvedValue(undefined),
  listSessionParticipants: jest.fn().mockResolvedValue([]),
  assignCoach: jest.fn().mockResolvedValue({ id: 1, coachId: 2 })
}));

describe("session routes", () => {
  it("returns sessions list", async () => {
    const response = await request(app).get("/api/sessions");
    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
  });
});
