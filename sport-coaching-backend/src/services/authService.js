const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const AppError = require("../utils/AppError");
const { signToken } = require("../utils/jwt");
const userRepository = require("../repositories/userRepository");

const roleNameMap = { ADMIN: "ADMIN", COACH: "COACH", CLIENT: "CLIENT" };

const authService = {
  async register({ email, password, roleName }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const role = await prisma.role.findUnique({ where: { name: roleNameMap[roleName] } });
    if (!role) {
      throw new AppError("Role not found", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createData = { email, password: hashedPassword, roleId: role.id };

    if (role.name === "COACH") {
      createData.coach = { create: {} };
    }
    if (role.name === "ADMIN") {
      createData.admin = { create: {} };
    }

    const user = await userRepository.createUser(createData);
    return {
      token: signToken({ userId: user.id, role: user.role.name }),
      user: { id: user.id, email: user.email, role: user.role.name }
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    return {
      token: signToken({ userId: user.id, role: user.role.name }),
      user: { id: user.id, email: user.email, role: user.role.name }
    };
  }
};

module.exports = authService;
