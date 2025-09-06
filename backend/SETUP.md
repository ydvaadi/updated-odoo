# SynergySphere Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synergysphere?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_SECRET="your-super-secret-access-key-here-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-in-production"

# JWT Expiration
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

#### Option A: Using PostgreSQL (Recommended)
1. Install PostgreSQL on your system
2. Create a database named `synergysphere`
3. Update the `DATABASE_URL` in your `.env` file
4. Run the following commands:

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with demo data
npm run seed
```

#### Option B: Using SQLite (For Development)
1. Update your `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Run the setup commands:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 4. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/invite` - Invite member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project
- `GET /api/projects/:id/overview` - Get project analytics

### Tasks
- `POST /api/tasks/projects/:id/tasks` - Create task in project
- `GET /api/tasks/projects/:id/tasks` - Get all tasks in project
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Messages
- `POST /api/messages/projects/:id/messages` - Post message in project
- `GET /api/messages/projects/:id/messages` - Get all messages in project

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread notification count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

## 🔧 Troubleshooting

### TypeScript Compilation Errors
If you encounter TypeScript errors, you can use the simplified version:
```bash
npx ts-node src/simple-index.ts
```

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check your `DATABASE_URL` in the `.env` file
3. Verify database credentials

### Port Already in Use
Change the `PORT` in your `.env` file to a different port (e.g., 3002)

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl http://localhost:3001/api/health

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Using Postman
1. Import the API collection (if available)
2. Set the base URL to `http://localhost:3001`
3. Test the endpoints

## 📊 Demo Data

The seed script creates:
- 5 demo users (password: `password123`)
- 3 sample projects
- 10+ tasks with various statuses
- Sample messages and notifications
- Project memberships

Demo user emails:
- john@example.com
- jane@example.com
- mike@example.com
- sarah@example.com
- alex@example.com

## 🔒 Security Notes

1. **Change JWT secrets** in production
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Regularly update dependencies**
5. **Use strong passwords** for database

## 📝 Next Steps

1. Set up your database
2. Configure environment variables
3. Run the seed script
4. Test the API endpoints
5. Integrate with your frontend

## 🆘 Support

If you encounter issues:
1. Check the console logs
2. Verify your environment setup
3. Ensure all dependencies are installed
4. Check database connectivity
