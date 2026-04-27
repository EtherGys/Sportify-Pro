const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sport Coaching API",
      version: "1.0.0",
      description: "REST API for coaching sessions management"
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Sessions", description: "Session management endpoints" },
      { name: "Bookings", description: "Booking endpoints for clients" },
      { name: "Users", description: "User administration endpoints" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Validation failed" },
            details: { type: "object", nullable: true }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                email: { type: "string", example: "client@sportcoach.app" },
                role: { type: "string", enum: ["ADMIN", "COACH", "CLIENT"] }
              }
            }
          }
        },
        SessionInput: {
          type: "object",
          required: ["title", "date", "maxParticipants"],
          properties: {
            title: { type: "string", example: "HIIT Full Body" },
            description: { type: "string", example: "Intense workout for all levels" },
            date: { type: "string", format: "date-time", example: "2026-05-01T10:00:00.000Z" },
            duration: { type: "integer", example: 60 },
            maxParticipants: { type: "integer", example: 12 },
            coachId: { type: "integer", example: 2, nullable: true }
          }
        },
        AssignCoachInput: {
          type: "object",
          required: ["coachId"],
          properties: {
            coachId: { type: "integer", example: 2 }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);
