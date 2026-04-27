const { z } = require("zod");

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
  roleName: z.enum(["ADMIN", "COACH", "CLIENT"])
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72)
});

module.exports = { registerSchema, loginSchema };
