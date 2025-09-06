# SynergySphere Backend API

A comprehensive backend API for the SynergySphere Advanced Team Collaboration Platform built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with access/refresh tokens
- **Project Management**: Create, manage, and collaborate on projects
- **Task Management**: Full CRUD operations for tasks with assignments and priorities
- **Real-time Messaging**: Project-based threaded conversations
- **Notifications**: Real-time notifications for project activities
- **Analytics**: Project overview with completion statistics and workload distribution
- **Security**: Password hashing with Argon2, rate limiting, CORS protection

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Argon2 password hashing
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding script
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database credentials and JWT secrets:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/synergysphere?schema=public"
   JWT_ACCESS_SECRET="your-super-secret-access-key-here"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database with demo data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Project Endpoints

- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/invite` - Invite member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project
- `GET /api/projects/:id/overview` - Get project analytics

### Task Endpoints

- `POST /api/tasks/projects/:id/tasks` - Create task in project
- `GET /api/tasks/projects/:id/tasks` - Get all tasks in project
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Message Endpoints

- `POST /api/messages/projects/:id/messages` - Post message in project
- `GET /api/messages/projects/:id/messages` - Get all messages in project

### Notification Endpoints

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread notification count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

## 🗄 Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **Project**: Team collaboration projects
- **Membership**: User-project relationships with roles
- **Task**: Project tasks with assignments and priorities
- **Message**: Project-based threaded conversations
- **Notification**: User notifications for project activities
- **RefreshToken**: JWT refresh token management

## 🔒 Security Features

- **Password Hashing**: Argon2 for secure password storage
- **JWT Authentication**: Access and refresh token pattern
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries

## 🧪 Demo Data

The seed script creates:
- 5 demo users with password `password123`
- 3 sample projects with different team compositions
- 10+ tasks across projects with various statuses and priorities
- Sample messages and notifications
- Project memberships with different roles

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database with demo data

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_ACCESS_SECRET` | Secret for access tokens | Required |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Required |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
