const { z } = require("zod");

const createSessionSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  date: z.iso.datetime(),
  duration: z.number().int().positive().optional(),
  maxParticipants: z.number().int().positive(),
  coachId: z.number().int().positive().optional()
});

const updateSessionSchema = createSessionSchema.partial();

const assignCoachSchema = z.object({
  coachId: z.number().int().positive()
});

module.exports = { createSessionSchema, updateSessionSchema, assignCoachSchema };
