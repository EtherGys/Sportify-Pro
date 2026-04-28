const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => {
  req.user = { id: 1, role: { name: "ADMIN" }, admin: { id: 1 } };
  next();
});

jest.mock("../src/middlewares/roleMiddleware", () => (...roles) => (req, res, next) => {
  next();
});

jest.mock("../src/services/userService", () => ({
  listUsers: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn()
}));

const userService = require("../src/services/userService");

describe("user routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users", () => {
    it("returns list of all users", async () => {
      const mockUsers = [
        {
          id: 1,
          email: "admin@test.com",
          role: "ADMIN",
          createdAt: "2026-01-01T00:00:00.000Z"
        },
        {
          id: 2,
          email: "coach@test.com",
          role: "COACH",
          createdAt: "2026-01-02T00:00:00.000Z"
        },
        {
          id: 3,
          email: "client@test.com",
          role: "CLIENT",
          createdAt: "2026-01-03T00:00:00.000Z"
        }
      ];
      userService.listUsers.mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(response.body).toHaveLength(3);
    });

    it("returns empty array when no users exist", async () => {
      userService.listUsers.mockResolvedValue([]);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("returns users with correct properties", async () => {
      const mockUsers = [
        {
          id: 1,
          email: "user@test.com",
          role: "CLIENT",
          createdAt: new Date()
        }
      ];
      userService.listUsers.mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/users");

      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("email");
      expect(response.body[0]).toHaveProperty("role");
      expect(response.body[0]).toHaveProperty("createdAt");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("deletes user successfully", async () => {
      userService.deleteUser.mockResolvedValue({ id: 3 });

      const response = await request(app).delete("/api/users/3");

      expect(response.status).toBe(204);
      expect(userService.deleteUser).toHaveBeenCalledWith(3);
    });

    it("returns 404 when user not found", async () => {
      const error = new Error("User not found");
      error.statusCode = 404;
      userService.deleteUser.mockRejectedValue(error);

      const response = await request(app).delete("/api/users/999");

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/users", () => {
    it("updates user successfully", async () => {
      const updatedUser = {
        id: 2,
        email: "newemail@test.com",
        role: "COACH"
      };
      userService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put("/api/users")
        .send({
          id: 2,
          email: "newemail@test.com",
          role: "COACH"
        });

      expect(response.status).toBe(204);
      expect(userService.updateUser).toHaveBeenCalledWith(2, "newemail@test.com", "COACH");
    });

    it("returns 404 when user to update not found", async () => {
      const error = new Error("User not found");
      error.statusCode = 404;
      userService.updateUser.mockRejectedValue(error);

      const response = await request(app)
        .put("/api/users")
        .send({
          id: 999,
          email: "newemail@test.com",
          role: "CLIENT"
        });

      expect(response.status).toBe(404);
    });

    it("updates user email only", async () => {
      const updatedUser = {
        id: 1,
        email: "updated@test.com",
        role: "ADMIN"
      };
      userService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put("/api/users")
        .send({
          id: 1,
          email: "updated@test.com",
          role: "ADMIN"
        });

      expect(response.status).toBe(204);
    });

    it("updates user role only", async () => {
      const updatedUser = {
        id: 2,
        email: "coach@test.com",
        role: "CLIENT"
      };
      userService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put("/api/users")
        .send({
          id: 2,
          email: "coach@test.com",
          role: "CLIENT"
        });

      expect(response.status).toBe(204);
    });
  });
});
