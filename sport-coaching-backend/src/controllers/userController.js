const userService = require("../services/userService");

const userController = {
  async list(req, res, next) {
    try {
      const users = await userService.listUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await userService.deleteUser(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { id, email, role } = req.body

      await userService.updateUser(id, email, role)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
};

module.exports = userController;
