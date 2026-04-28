# Sportify Pro

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

## Docker Full Stack (Recommended)
Run the full application (MySQL + Backend + Frontend):

```bash
docker compose up --build
```
### Services
Backend API : `http://localhost:4000`
Frontend :`http://localhost:3000`
Swagger : `http://localhost:4000/api-docs`


## Environment Variables
Create a .env file at the root:

```env
MYSQL_ROOT_PASSWORD=root

PORT=4000
NODE_ENV=development
DATABASE_URL=mysql://root:root@db:3306/sportify_pro_db
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

# Important Notes (Docker Networking)
- Inside Docker, services communicate using their service names:
  - db → MySQL
  - backend → API

- From your browser:
  - use localhost, NOT backend

# Database Initialization
On startup, the backend automatically:

- syncs the database schema (prisma db push)
- runs seed data (prisma db seed)

No manual setup required.

# Manual Commands (optional)
Run Prisma commands manually inside the container:

```bash
docker compose exec backend npx prisma studio
docker compose exec backend npx prisma db push
docker compose exec backend npm run prisma:seed
```
## Local Development (without Docker)

```bash
npm install
cp .env.example .env
```

Update your DB URL for local usage:

```env
DATABASE_URL=mysql://root:root@localhost:3306/sportify_pro_db
```

Then:

```bash
npx prisma migrate dev
npm run prisma:seed
npm run dev
```