const AppError = require("../utils/AppError");

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.name)) {
    return next(new AppError("Forbidden", 403));
  }
  return next();
};

module.exports = roleMiddleware;
