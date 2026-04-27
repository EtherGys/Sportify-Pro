const AppError = require("../utils/AppError");
const prisma = require("../config/db");
const { verifyToken } = require("../utils/jwt");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
  
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true, coach: true, admin: true }
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
}

module.exports = authMiddleware;
