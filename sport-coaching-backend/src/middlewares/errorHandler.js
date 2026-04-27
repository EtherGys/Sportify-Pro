const { logError } = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  logError("API error", { message: err.message, statusCode });
  res.status(statusCode).json({
    message: err.message || "Internal server error",
    details: err.details || null
  });
}

module.exports = errorHandler;
