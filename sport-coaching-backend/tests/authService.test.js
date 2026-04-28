const authService = require("../src/services/authService");
const userRepository = require("../src/repositories/userRepository");
const AppError = require("../src/utils/AppError");

jest.mock("../src/repositories/userRepository", () => ({
  findByEmail: jest.fn(),
  createUser: jest.fn()
}));

jest.mock("../src/config/db", () => ({
  role: { findUnique: jest.fn() }
}));

const prisma = require("../src/config/db");

describe("authService.login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when user does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(authService.login({ email: "x@test.com", password: "Password123!" })).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("throws when password is invalid", async () => {
    const bcrypt = require("bcryptjs");
    const password = "Password123!";
    const hash = await bcrypt.hash(password, 10);
    userRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: "client@test.com",
      password: hash,
      role: { name: "CLIENT" }
    });

    await expect(
      authService.login({ email: "client@test.com", password: "WrongPassword123!" })
    ).rejects.toThrow("Invalid credentials");
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
    expect(result.user.id).toBe(1);
    expect(result.user.role).toBe("CLIENT");
    expect(result.token).toBeDefined();
  });

  it("returns token and user for admin role", async () => {
    const bcrypt = require("bcryptjs");
    const password = "AdminPass123!";
    const hash = await bcrypt.hash(password, 10);
    userRepository.findByEmail.mockResolvedValue({
      id: 2,
      email: "admin@test.com",
      password: hash,
      role: { name: "ADMIN" }
    });

    const result = await authService.login({ email: "admin@test.com", password });
    expect(result.user.role).toBe("ADMIN");
    expect(result.token).toBeDefined();
  });

  it("returns token and user for coach role", async () => {
    const bcrypt = require("bcryptjs");
    const password = "CoachPass123!";
    const hash = await bcrypt.hash(password, 10);
    userRepository.findByEmail.mockResolvedValue({
      id: 3,
      email: "coach@test.com",
      password: hash,
      role: { name: "COACH" }
    });

    const result = await authService.login({ email: "coach@test.com", password });
    expect(result.user.role).toBe("COACH");
    expect(result.token).toBeDefined();
  });
});

describe("authService.register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when email is already in use", async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: "existing@test.com"
    });

    await expect(
      authService.register({
        email: "existing@test.com",
        password: "Password123!",
        roleName: "CLIENT"
      })
    ).rejects.toThrow("Email already in use");
  });

  it("throws when role does not exist", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue(null);

    await expect(
      authService.register({
        email: "new@test.com",
        password: "Password123!",
        roleName: "INVALID_ROLE"
      })
    ).rejects.toThrow("Role not found");
  });

  it("creates client user with requested role", async () => {
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
    expect(result.user.email).toBe("new@test.com");
    expect(result.user.id).toBe(4);
    expect(result.token).toBeDefined();
    expect(userRepository.createUser).toHaveBeenCalled();
  });

  it("creates coach user with coach profile", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue({ id: 3, name: "COACH" });
    userRepository.createUser.mockResolvedValue({
      id: 5,
      email: "coach@test.com",
      role: { name: "COACH" },
      coach: { id: 1 }
    });

    const result = await authService.register({
      email: "coach@test.com",
      password: "Password123!",
      roleName: "COACH"
    });

    expect(result.user.role).toBe("COACH");
    expect(userRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "coach@test.com",
        coach: { create: {} }
      })
    );
  });

  it("creates admin user with admin profile", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue({ id: 1, name: "ADMIN" });
    userRepository.createUser.mockResolvedValue({
      id: 6,
      email: "admin@test.com",
      role: { name: "ADMIN" },
      admin: { id: 1 }
    });

    const result = await authService.register({
      email: "admin@test.com",
      password: "Password123!",
      roleName: "ADMIN"
    });

    expect(result.user.role).toBe("ADMIN");
    expect(userRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "admin@test.com",
        admin: { create: {} }
      })
    );
  });

  it("hashes password before storing", async () => {
    const bcrypt = require("bcryptjs");
    const hashSpy = jest.spyOn(bcrypt, "hash");

    userRepository.findByEmail.mockResolvedValue(null);
    prisma.role.findUnique.mockResolvedValue({ id: 2, name: "CLIENT" });
    userRepository.createUser.mockResolvedValue({
      id: 7,
      email: "secure@test.com",
      role: { name: "CLIENT" }
    });

    await authService.register({
      email: "secure@test.com",
      password: "Password123!",
      roleName: "CLIENT"
    });

    expect(hashSpy).toHaveBeenCalledWith("Password123!", 10);
    hashSpy.mockRestore();
  });
});
