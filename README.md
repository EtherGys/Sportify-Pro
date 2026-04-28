# Sportify Pro

Production-ready full-stack application for a sports coaching sessions platform.

## Tech Stack

### Backend
- Node.js + Express.js
- MySQL
- Prisma ORM
- JWT Authentication + RBAC
- Layered architecture (Controller / Service / Repository / Middleware)
- Zod validation
- Swagger (OpenAPI)
- Jest unit tests

### Frontend
- Vue 3 + TypeScript
- Vite
- Pinia (state management)
- Vue Router
- Tailwind CSS + PostCSS
- Axios HTTP client

### DevOps
- Docker + Docker Compose

## Project Structure

```
sportify_pro/
├── sport-coaching-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── prisma/
│   ├── tests/
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── sport-coaching-frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## Database Schema

The application uses Prisma ORM with:

- `Role` - ADMIN, COACH, CLIENT
- `User` - Email, password, role assignment
- `Coach` - Coach profile linked to User
- `Admin` - Admin profile linked to User
- `Session` - Coaching session details, coach assignment, capacity
- `Booking` - User booking for sessions

See [sport-coaching-backend/prisma/schema.prisma](sport-coaching-backend/prisma/schema.prisma) for full schema.

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

## Getting Started (Local Development)

### Prerequisites

- Node.js 22+
- MySQL 8.4+
- npm

### Backend Setup

1. Navigate to backend:
```bash
cd sport-coaching-backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` with your local MySQL credentials:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mysql://root:your_password@localhost:3306/sport_coaching_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

4. Run database migrations and seed:
```bash
npx prisma migrate dev
npm run prisma:seed
```

5. Start backend:
```bash
npm run dev
```

Backend API runs on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend (from project root):
```bash
cd sport-coaching-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **API Documentation**: http://localhost:4000/api-docs

## Development Commands

### Backend

```bash
npm run dev              # Start with nodemon (auto-reload)
npm run start            # Start production server
npm test                 # Run unit tests
npm test -- --coverage  # Run tests with coverage
npm run test:watch      # Watch mode tests
npm run prisma:seed     # Run database seed
npm run prisma:migrate  # Create/run migrations
npx prisma studio      # Open Prisma Studio (GUI)
```

### Frontend

```bash
npm run dev      # Start Vite dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
```

## Docker Deployment

Run the complete full-stack application with Docker Compose.

### Prerequisites

- Docker Engine 24+
- Docker Compose 2+

### Launch

From the project root:

```bash
docker compose up --build
```

This will start:
- **MySQL Database** (port 3306, exposed for debugging)
- **Backend API** (port 4000)
- **Frontend** (port 3000)

### Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **API Documentation**: http://localhost:4000/api-docs

### Database Auto-Initialization

On startup, the Docker backend automatically:
- Runs database migrations
- Seeds the database with test data

No manual setup required.

### Stop Services

```bash
docker compose down          # Stop all services
docker compose down -v       # Stop and remove volumes (resets database)
```

### Docker Networking

Inside the Docker network:
- Services communicate using service names:
  - `db` → MySQL (port 3306)
  - `api` → Backend API
  - `frontend` → Frontend web server

From your browser on the host machine:
- Use `localhost`, NOT service names

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Connection
# Local: mysql://root:password@localhost:3306/sport_coaching_db
# Docker: mysql://root:root@db:3306/sport_coaching_db
DATABASE_URL=mysql://root:your_password@localhost:3306/sport_coaching_db

# JWT Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
```

### Frontend (.env)

Frontend uses environment variables for API configuration (set in Docker build args).

## Testing

### Backend Unit Tests

```bash
cd sport-coaching-backend
npm test                 # Run all tests once
npm test -- --coverage  # Generate coverage report
npm run test:watch      # Watch mode
```

## API Documentation

Swagger UI provides interactive API documentation with:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example payloads

Accessible at: `http://localhost:4000/api-docs`

## Troubleshooting

### Port Already in Use

**Check port usage (Windows):**
```powershell
netstat -ano | findstr ":3306"
```

**Stop MySQL service (Windows):**
```powershell
net stop MySQL
```

### Docker Database Connection Error

```bash
# Reset database volume and restart
docker compose down -v
docker compose up --build
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
npx prisma generate
```

## Notes

- **Local Development**: Use `localhost:3306` for MySQL
- **Docker Internal**: Use `db:3306` (Docker network)
- **Port Conflicts**: Ensure ports 3306, 4000, 5173, and 3000 are available
- **Database Persistence**: Docker volumes persist MySQL data between container restarts