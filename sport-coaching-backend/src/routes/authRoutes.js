const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, roleName]
 *             properties:
 *               email: { type: string, example: "client@sportcoach.app" }
 *               password: { type: string, example: "Password123!" }
 *               roleName: { type: string, enum: [ADMIN, COACH, CLIENT], example: CLIENT }
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email already exists
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "client@sportcoach.app" }
 *               password: { type: string, example: "Password123!" }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
