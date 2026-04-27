const authService = require("../src/services/authService");
const userRepository = require("../src/repositories/userRepository");

jest.mock("../src/repositories/userRepository", () => ({
  findByEmail: jest.fn(),
  createUser: jest.fn()
}));

jest.mock("../src/config/db", () => ({
  role: { findUnique: jest.fn() }
}));

const prisma = require("../src/config/db");

describe("authService.login", () => {
  it("throws when user does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(authService.login({ email: "x@test.com", password: "Password123!" })).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("returns token and user for valid credentials", async () => {
    const bcrypt = require("bcryptjs");
    const password = "Password123!";
    const hash = await bcrypt.hash(password, 10);
    userRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: "client@test.com",
      password: hash,
      role: { name: "CLIENT" }
    });

    const result = await authService.login({ email: "client@test.com", password });
    expect(result.user.email).toBe("client@test.com");
    expect(result.token).toBeDefined();
  });
});

describe("authService.register", () => {
  it("creates user with requested role", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue({ id: 2, name: "CLIENT" });
    userRepository.createUser.mockResolvedValue({
      id: 4,
      email: "new@test.com",
      role: { name: "CLIENT" }
    });

    const result = await authService.register({
      email: "new@test.com",
      password: "Password123!",
      roleName: "CLIENT"
    });

    expect(result.user.role).toBe("CLIENT");
    expect(userRepository.createUser).toHaveBeenCalled();
  });
});
