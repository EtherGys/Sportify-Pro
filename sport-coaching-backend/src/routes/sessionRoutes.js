const express = require("express");
const sessionController = require("../controllers/sessionController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const {
  createSessionSchema,
  updateSessionSchema,
  assignCoachSchema
} = require("../validators/sessionValidator");

const router = express.Router();

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     tags: [Sessions]
 *     summary: List sessions with pagination and search
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: "HIIT" }
 *     responses:
 *       200:
 *         description: Sessions list
 *
 *   post:
 *     tags: [Sessions]
 *     summary: Create a new session (ADMIN or COACH)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionInput'
 *     responses:
 *       201:
 *         description: Session created
 *       403:
 *         description: Forbidden
 *
 * /api/sessions/{id}:
 *   patch:
 *     tags: [Sessions]
 *     summary: Update a session (coach owner or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionInput'
 *     responses:
 *       200:
 *         description: Session updated
 *   delete:
 *     tags: [Sessions]
 *     summary: Delete a session (coach owner or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       204:
 *         description: Session deleted
 *
 * /api/sessions/{id}/participants:
 *   get:
 *     tags: [Sessions]
 *     summary: List participants of a session (coach owner or admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Participants list
 *
 * /api/sessions/{id}/assign-coach:
 *   patch:
 *     tags: [Sessions]
 *     summary: Assign or reassign coach to a session (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignCoachInput'
 *     responses:
 *       200:
 *         description: Coach assigned
 */
router.get("/", authMiddleware, sessionController.list);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("COACH", "ADMIN"),
  validate(createSessionSchema),
  sessionController.create
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("COACH", "ADMIN"),
  validate(updateSessionSchema),
  sessionController.update
);
router.delete("/:id", authMiddleware, roleMiddleware("COACH", "ADMIN"), sessionController.remove);
router.get(
  "/:id/participants",
  authMiddleware,
  roleMiddleware("COACH", "ADMIN"),
  sessionController.participants
);
router.patch(
  "/:id/assign-coach",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validate(assignCoachSchema),
  sessionController.assignCoach
);
router.get("/mine", authMiddleware, roleMiddleware("COACH"), sessionController.listMine);

module.exports = router;
