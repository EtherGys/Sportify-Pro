const express = require("express");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     tags: [Bookings]
 *     summary: List current user's bookings (client only)
 *     responses:
 *       200:
 *         description: Bookings list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/bookings/{sessionId}:
 *   post:
 *     tags: [Bookings]
 *     summary: Book a session (client only)
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Booking created
 *       409:
 *         description: Full session or conflicting booking
 *   delete:
 *     tags: [Bookings]
 *     summary: Cancel a booking (client only)
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       204:
 *         description: Booking canceled
 *       404:
 *         description: Booking not found
 */
router.get("/me", authMiddleware, roleMiddleware("CLIENT"), bookingController.listMine);
router.post("/:sessionId", authMiddleware, roleMiddleware("CLIENT"), bookingController.create);
router.delete("/:sessionId", authMiddleware, roleMiddleware("CLIENT"), bookingController.cancel);

module.exports = router;
