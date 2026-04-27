# Sport Coaching Backend

Production-ready Node.js backend for a sports coaching sessions platform.

## Tech Stack

- Node.js + Express.js
- MySQL
- Prisma ORM
- JWT Authentication + RBAC
- Layered architecture (Controller / Service / Repository / Middleware)
- Zod validation
- Swagger (OpenAPI)
- Jest unit tests
- Docker + docker-compose

## Project Architecture

```text
src/
  config/
  controllers/
  middlewares/
  repositories/
  routes/
  services/
  utils/
  validators/
prisma/
tests/
```

## Prisma Schema

See `prisma/schema.prisma` for the complete relational model with:

- `Role`, `User`, `Coach`, `Admin`, `Session`, `Booking`
- enum role management
- unique booking constraints
- date indexing for sessions

## Business Rules Implemented

- Full JWT authentication flow (`register`, `login`)
- Role-based permissions for `CLIENT`, `COACH`, `ADMIN`
- Coach can manage only own sessions
- Admin can manage all sessions and users
- Mandatory coach assignment for each session
- Session capacity enforcement
- Duplicate booking prevention
- Time-slot conflict prevention (same user, overlapping slot)
- Participant visibility restricted to coach owner/admin

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Start MySQL (Docker):

```bash
docker compose up -d db
```

4. Run migrations and generate Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Seed data:

```bash
npm run prisma:seed
```

6. Run API:

```bash
npm run dev
```

## API Documentation

Swagger UI: `http://localhost:4000/api-docs`

## Tests

```bash
npm test
```

## Docker Full Stack

```bash
docker compose up --build
```

## Environment Variables

- `PORT`
- `NODE_ENV`
- `DATABASE_URL` (example: `mysql://root:root@localhost:3306/sport_coaching_db`)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
