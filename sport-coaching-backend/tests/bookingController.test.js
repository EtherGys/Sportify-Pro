const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => {
  req.user = { id: 1, role: { name: "CLIENT" } };
  next();
});

jest.mock("../src/middlewares/roleMiddleware", () => (...roles) => (req, res, next) => {
  next();
});

jest.mock("../src/services/bookingService", () => ({
  createBooking: jest.fn(),
  cancelBooking: jest.fn(),
  listMyBookings: jest.fn()
}));

const bookingService = require("../src/services/bookingService");

describe("booking routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/bookings/:sessionId", () => {
    it("creates booking successfully", async () => {
      const newBooking = {
        id: 1,
        userId: 1,
        sessionId: 5
      };
      bookingService.createBooking.mockResolvedValue(newBooking);

      const response = await request(app)
        .post("/api/bookings/5");

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newBooking);
      expect(bookingService.createBooking).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        5
      );
    });

    it("returns 404 when session not found", async () => {
      const error = new Error("Session not found");
      error.statusCode = 404;
      bookingService.createBooking.mockRejectedValue(error);

      const response = await request(app).post("/api/bookings/999");

      expect(response.status).toBe(404);
    });

    it("returns 409 when session already booked", async () => {
      const error = new Error("Session already booked");
      error.statusCode = 409;
      bookingService.createBooking.mockRejectedValue(error);

      const response = await request(app).post("/api/bookings/5");

      expect(response.status).toBe(409);
    });

    it("returns 409 when session is full", async () => {
      const error = new Error("Session is full");
      error.statusCode = 409;
      bookingService.createBooking.mockRejectedValue(error);

      const response = await request(app).post("/api/bookings/5");

      expect(response.status).toBe(409);
    });

    it("returns 409 when there is a time conflict", async () => {
      const error = new Error("Cannot book two sessions in the same time slot");
      error.statusCode = 409;
      bookingService.createBooking.mockRejectedValue(error);

      const response = await request(app).post("/api/bookings/5");

      expect(response.status).toBe(409);
    });
  });

  describe("DELETE /api/bookings/:sessionId", () => {
    it("cancels booking successfully", async () => {
      bookingService.cancelBooking.mockResolvedValue(undefined);

      const response = await request(app)
        .delete("/api/bookings/5");

      expect(response.status).toBe(204);
      expect(bookingService.cancelBooking).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 }),
        5
      );
    });

    it("returns 404 when booking not found", async () => {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      bookingService.cancelBooking.mockRejectedValue(error);

      const response = await request(app).delete("/api/bookings/999");

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/bookings/me", () => {
    it("returns user's bookings", async () => {
      const mockBookings = [
        {
          id: 1,
          userId: 1,
          sessionId: 5,
          session: { title: "Session 1", date: "2026-04-28T09:38:34.208Z" }
        },
        {
          id: 2,
          userId: 1,
          sessionId: 6,
          session: { title: "Session 2", date: "2026-04-28T09:38:34.208Z" }
        }
      ];
      bookingService.listMyBookings.mockResolvedValue(mockBookings);

      const response = await request(app).get("/api/bookings/me");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
      expect(response.body).toHaveLength(2);
    });

    it("returns empty array when user has no bookings", async () => {
      bookingService.listMyBookings.mockResolvedValue([]);

      const response = await request(app).get("/api/bookings/me");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
