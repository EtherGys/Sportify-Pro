const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/middlewares/validate", () => (schema) => (req, res, next) => {
  next();
});

jest.mock("../src/services/authService", () => ({
  register: jest.fn(),
  login: jest.fn()
}));

const authService = require("../src/services/authService");

describe("auth routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("registers new user successfully", async () => {
      const newUser = {
        user: { id: 1, email: "new@test.com", role: "CLIENT" },
        token: "jwt-token-123"
      };
      authService.register.mockResolvedValue(newUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "new@test.com",
          password: "Password123!",
          roleName: "CLIENT"
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
      expect(authService.register).toHaveBeenCalledWith({
        email: "new@test.com",
        password: "Password123!",
        roleName: "CLIENT"
      });
    });

    it("returns 409 when email already in use", async () => {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      authService.register.mockRejectedValue(error);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "existing@test.com",
          password: "Password123!",
          roleName: "CLIENT"
        });

      expect(response.status).toBe(409);
    });

    it("returns 400 when role not found", async () => {
      const error = new Error("Role not found");
      error.statusCode = 400;
      authService.register.mockRejectedValue(error);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "new@test.com",
          password: "Password123!",
          roleName: "INVALID_ROLE"
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in user successfully", async () => {
      const loginResult = {
        user: { id: 1, email: "client@test.com", role: "CLIENT" },
        token: "jwt-token-456"
      };
      authService.login.mockResolvedValue(loginResult);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "client@test.com",
          password: "Password123!"
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(loginResult);
      expect(authService.login).toHaveBeenCalledWith({
        email: "client@test.com",
        password: "Password123!"
      });
    });

    it("returns 401 for invalid credentials", async () => {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      authService.login.mockRejectedValue(error);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@test.com",
          password: "WrongPassword!"
        });

      expect(response.status).toBe(401);
    });

    it("returns 401 for non-existent user", async () => {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      authService.login.mockRejectedValue(error);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "Password123!"
        });

      expect(response.status).toBe(401);
    });
  });
});
