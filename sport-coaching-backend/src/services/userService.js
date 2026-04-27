const AppError = require("../utils/AppError");
const userRepository = require("../repositories/userRepository");

const userService = {
  async listUsers() {
    const users = await userRepository.listUsers();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role.name,
      createdAt: user.createdAt
    }));
  },

  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return userRepository.deleteUser(id);
  },
  async updateUser(id, email, role) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return userRepository.updateUser(id, email, role);
  }
};

module.exports = userService;
