const userService = require("../src/services/userService");
const userRepository = require("../src/repositories/userRepository");
const AppError = require("../src/utils/AppError");

jest.mock("../src/repositories/userRepository", () => ({
  listUsers: jest.fn(),
  findById: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn()
}));

describe("userService.listUsers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty list when no users exist", async () => {
    userRepository.listUsers.mockResolvedValue([]);

    const result = await userService.listUsers();

    expect(result).toEqual([]);
  });

  it("returns list of users with formatted data", async () => {
    const mockUsers = [
      {
        id: 1,
        email: "admin@test.com",
        role: { name: "ADMIN" },
        createdAt: new Date("2026-01-01")
      },
      {
        id: 2,
        email: "coach@test.com",
        role: { name: "COACH" },
        createdAt: new Date("2026-01-02")
      },
      {
        id: 3,
        email: "client@test.com",
        role: { name: "CLIENT" },
        createdAt: new Date("2026-01-03")
      }
    ];
    userRepository.listUsers.mockResolvedValue(mockUsers);

    const result = await userService.listUsers();

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: 1,
      email: "admin@test.com",
      role: "ADMIN",
      createdAt: new Date("2026-01-01")
    });
    expect(result[1]).toEqual({
      id: 2,
      email: "coach@test.com",
      role: "COACH",
      createdAt: new Date("2026-01-02")
    });
  });
});

describe("userService.deleteUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when user does not exist", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.deleteUser(999)).rejects.toThrow("User not found");
    expect(userRepository.findById).toHaveBeenCalledWith(999);
  });

  it("deletes user successfully", async () => {
    userRepository.findById.mockResolvedValue({ id: 1, email: "user@test.com" });
    userRepository.deleteUser.mockResolvedValue({ id: 1 });

    const result = await userService.deleteUser(1);

    expect(result).toEqual({ id: 1 });
    expect(userRepository.deleteUser).toHaveBeenCalledWith(1);
  });
});

describe("userService.updateUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws when user does not exist", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      userService.updateUser(999, "new@test.com", "CLIENT")
    ).rejects.toThrow("User not found");
  });

  it("updates user email and role successfully", async () => {
    userRepository.findById.mockResolvedValue({ id: 1, email: "old@test.com" });
    userRepository.updateUser.mockResolvedValue({
      id: 1,
      email: "new@test.com",
      role: { name: "COACH" }
    });

    const result = await userService.updateUser(1, "new@test.com", "COACH");

    expect(result).toEqual({
      id: 1,
      email: "new@test.com",
      role: { name: "COACH" }
    });
    expect(userRepository.updateUser).toHaveBeenCalledWith(1, "new@test.com", "COACH");
  });
});
