# HooraFlix Backend API

Node.js/Express backend for HooraFlix streaming platform with authentication, user management, and founder/referral system.

## Features

- **Authentication**: JWT-based auth with access and refresh tokens
- **User Management**: Profile management and role-based access control
- **Founder System**: Founder verification, referral tracking, and earnings
- **Database**: PostgreSQL with Prisma ORM
- **Dockerized**: Full Docker Compose setup with database

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository and navigate to the project root**

2. **Start all services** (database + backend + frontend):
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5001/api
   - Database: localhost:5432

### Local Development

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://hooraflix:hooraflix123@localhost:5432/hooraflix?schema=public"
   JWT_ACCESS_SECRET="your-super-secret-access-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   NODE_ENV="development"
   PORT=5000
   FRONTEND_URL="http://localhost:3001"
   ```

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database**:
   ```bash
   npm run prisma:seed
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PATCH /api/users/profile` - Update user profile (protected)

### Founders
- `POST /api/founders/verify-code` - Verify founder code
- `GET /api/founders/dashboard` - Get founder dashboard stats (protected, founder only)
- `GET /api/founders/referrals` - Get referrals list (protected, founder only)
- `GET /api/founders/stats` - Get referral statistics (protected, founder only)

## Test Credentials

After seeding the database, you can use these credentials:

- **Admin**: `admin@hooraflix.com` / `admin123456`
- **Founder**: `founder@hooraflix.com` / `founder123`
- **Users**: `user1@example.com` to `user5@example.com` / `user[1-5]123`
- **Founder Codes**: `HOORA2026`, `FOUNDER100`, `ELITE2026`

## Database Schema

### User
- id, email, password, name, role, isFounder
- Roles: USER, FOUNDER, ADMIN

### Founder
- id, userId, founderCode, rank, totalEarnings, referralLink
- Ranks: BRONZE, SILVER, GOLD, PLATINUM

### Referral
- id, founderId, referredUserId, status, joinedAt
- Status: PENDING, ACTIVE, INACTIVE

### FounderCode
- id, code, isActive, maxUses, usedCount

### RefreshToken
- id, token, userId, expiresAt

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with test data
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run docker:init` - Initialize database and start (used in Docker)

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken, bcryptjs)
- **Validation**: express-validator
- **Security**: helmet, cors

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Prisma client
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth logic
│   │   ├── founder.controller.js # Founder logic
│   │   └── user.controller.js   # User logic
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── error.middleware.js  # Error handling
│   │   └── validation.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── founder.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── jwt.util.js          # Token utilities
│   │   └── password.util.js     # Password hashing
│   └── server.js                # Express app
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.js                  # Seed script
├── Dockerfile
├── package.json
└── .env.example
```

## License

MIT
