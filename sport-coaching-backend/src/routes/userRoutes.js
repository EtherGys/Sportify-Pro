const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users (admin only)
 *     responses:
 *       200:
 *         description: Users list
 *       403:
 *         description: Forbidden
 *
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 5 }
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.get("/", authMiddleware, roleMiddleware("ADMIN"), userController.list);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), userController.remove);
router.put("/", authMiddleware, roleMiddleware("ADMIN"), userController.update);

module.exports = router;
