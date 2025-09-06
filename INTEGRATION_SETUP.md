# SynergySphere - Full Stack Integration Setup

This document provides complete setup instructions for the integrated SynergySphere application with both frontend and backend.

## Project Structure

```
frontend-odoo/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── middleware/      # Authentication, validation, error handling
│   │   ├── routes/          # API route definitions
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Database, JWT, validation utilities
│   ├── prisma/              # Database schema and migrations
│   └── package.json
├── src/                     # React frontend application
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── contexts/           # React context providers
│   ├── services/           # API service layer
│   └── types/              # Frontend type definitions
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synergysphere?schema=public"

# JWT Secrets (CHANGE THESE IN PRODUCTION)
JWT_ACCESS_SECRET="your-super-secret-access-key-here-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-this-in-production"

# JWT Expiration (in seconds)
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

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run seed
```

### 4. Start Backend Server

```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

## Frontend Setup

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:3001/api
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Quick Start (Both Servers)

### Windows
```bash
# Run the batch file
start-dev.bat
```

### Linux/Mac
```bash
# Make executable and run
chmod +x start-dev.sh
./start-dev.sh
```

### Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/invite` - Invite member
- `DELETE /api/projects/:id/members/:userId` - Remove member
- `GET /api/projects/:id/overview` - Get project analytics

### Tasks
- `GET /api/tasks/projects/:id/tasks` - Get project tasks
- `POST /api/tasks/projects/:id/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Messages
- `GET /api/messages/projects/:id/messages` - Get project messages
- `POST /api/messages/projects/:id/messages` - Send message

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## Features

### Frontend Features
- ✅ User authentication (login/register)
- ✅ Project management (CRUD operations)
- ✅ Task management with status tracking
- ✅ Real-time messaging system
- ✅ Notification system
- ✅ Responsive design with modern UI
- ✅ TypeScript support
- ✅ Error handling and loading states

### Backend Features
- ✅ RESTful API with Express.js
- ✅ JWT-based authentication
- ✅ PostgreSQL database with Prisma ORM
- ✅ Input validation with Zod
- ✅ Rate limiting and security middleware
- ✅ Comprehensive error handling
- ✅ TypeScript support
- ✅ Database migrations and seeding

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts with authentication
- **Projects** - Team collaboration projects
- **Memberships** - User-project relationships with roles
- **Tasks** - Project tasks with assignments and status
- **Messages** - Project discussion messages
- **Notifications** - User notifications
- **RefreshTokens** - JWT refresh token management

## Development Notes

### Type Safety
- Both frontend and backend use TypeScript
- Shared types ensure consistency between API and UI
- Prisma generates type-safe database queries

### Authentication Flow
1. User registers/logs in
2. Backend returns access and refresh tokens
3. Frontend stores tokens in localStorage
4. API requests include Bearer token in Authorization header
5. Tokens are automatically refreshed when expired

### Error Handling
- Consistent error response format across all endpoints
- Frontend displays user-friendly error messages
- Comprehensive validation on both client and server

### Security
- Password hashing with Argon2
- JWT tokens for stateless authentication
- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Run `npx prisma migrate dev`

2. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check that frontend is running on correct port

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT secrets in backend .env
   - Verify token expiration settings

4. **Build Errors**
   - Run `npm install` in both frontend and backend
   - Check Node.js version compatibility
   - Clear node_modules and reinstall if needed

## Production Deployment

### Backend
1. Set production environment variables
2. Use a production PostgreSQL database
3. Set secure JWT secrets
4. Configure proper CORS origins
5. Use a process manager like PM2

### Frontend
1. Build the application: `npm run build`
2. Serve static files with a web server
3. Configure environment variables for production API URL

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console and network tabs for errors
4. Verify database connection and migrations

