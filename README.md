# HooraFlix - Full Stack Streaming Platform

A modern streaming platform with authentication, founder/referral system, and Docker deployment.

## 🚀 Quick Start with Docker

Start all services (database + backend + frontend):

```bash
docker-compose up --build
```

**Access the application**:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/api
- Database: PostgreSQL on localhost:5432

## 📁 Project Structure

```
hooraflix/
├── backend/              # Node.js/Express API
│   ├── src/             # Source code
│   ├── prisma/          # Database schema & migrations
│   ├── Dockerfile       # Backend container
│   └── README.md        # Backend documentation
├── src/                 # React frontend
├── docker-compose.yaml  # Multi-service orchestration
├── Dockerfile           # Frontend container (Nginx)
└── nginx.conf           # Nginx reverse proxy config
```

## 🧪 Test Credentials

After the first startup, use these credentials:

- **Admin**: `admin@hooraflix.com` / `admin123456`
- **Founder**: `founder@hooraflix.com` / `founder123`
- **Founder Codes**: `HOORA2026`, `FOUNDER100`, `ELITE2026`

## 🔑 Key Features

✅ JWT-based authentication  
✅ Founder verification system  
✅ Referral tracking & earnings  
✅ PostgreSQL database  
✅ Fully Dockerized  
✅ API documentation  

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- Database runs on PostgreSQL 16
- Frontend built with React + Vite
- Nginx handles API proxying

## 🛠️ Development

### Backend Only
```bash
cd backend
npm install
npm run dev
```

### Frontend Only
```bash
npm install
npm run dev
```

## 📝 Environment Variables

The `.env` file is auto-managed by Docker Compose. For local development, see `backend/.env.example`.

## 🐳 Docker Services

1. **postgres** - PostgreSQL 16 database
2. **backend** - Node.js/Express API (port 5001)
3. **frontend** - React app with Nginx (port 3001)

## License

MIT
