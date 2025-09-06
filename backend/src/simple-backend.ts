import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SynergySphere API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', createdAt: new Date().toISOString() },
];

const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberships: [
      { id: '1', role: 'ADMIN', user: mockUsers[0] },
      { id: '2', role: 'MEMBER', user: mockUsers[1] },
    ],
    _count: { tasks: 5, messages: 12 }
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android app for task management',
    createdBy: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberships: [
      { id: '3', role: 'ADMIN', user: mockUsers[1] },
      { id: '4', role: 'MEMBER', user: mockUsers[0] },
    ],
    _count: { tasks: 8, messages: 15 }
  },
];

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
    });
  }

  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Create new user
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);

  // Generate mock tokens
  const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser,
      accessToken,
      refreshToken,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  // Find user
  const user = mockUsers.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Generate mock tokens
  const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  // Generate new access token
  const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { accessToken },
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock authenticated user
  const user = mockUsers[0];
  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Project routes
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    message: 'Projects retrieved successfully',
    data: mockProjects,
  });
});

app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    message: 'Project retrieved successfully',
    data: project,
  });
});

app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Project name is required',
    });
  }

  const newProject = {
    id: (mockProjects.length + 1).toString(),
    name,
    description: description || null,
    createdBy: '1', // Mock user ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberships: [
      { id: '1', role: 'ADMIN', user: mockUsers[0] },
    ],
    _count: { tasks: 0, messages: 0 }
  };

  mockProjects.push(newProject);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: newProject,
  });
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    name: name || mockProjects[projectIndex].name,
    description: description !== undefined ? description : mockProjects[projectIndex].description,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: mockProjects[projectIndex],
  });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  mockProjects.splice(projectIndex, 1);

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});

// Task routes
app.get('/api/tasks/projects/:id/tasks', (req, res) => {
  res.json({
    success: true,
    message: 'Tasks retrieved successfully',
    data: [],
  });
});

app.get('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Task retrieved successfully',
    data: null,
  });
});

app.post('/api/tasks/projects/:id/tasks', (req, res) => {
  res.json({
    success: true,
    message: 'Task created successfully',
    data: null,
  });
});

app.put('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Task updated successfully',
    data: null,
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
});

// Message routes
app.get('/api/messages/projects/:id/messages', (req, res) => {
  res.json({
    success: true,
    message: 'Messages retrieved successfully',
    data: [],
  });
});

app.post('/api/messages/projects/:id/messages', (req, res) => {
  res.json({
    success: true,
    message: 'Message created successfully',
    data: null,
  });
});

// Notification routes
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    },
  });
});

app.get('/api/notifications/unread-count', (req, res) => {
  res.json({
    success: true,
    message: 'Unread count retrieved successfully',
    data: { count: 0 },
  });
});

app.put('/api/notifications/:id/read', (req, res) => {
  res.json({
    success: true,
    message: 'Notification marked as read',
  });
});

app.put('/api/notifications/mark-all-read', (req, res) => {
  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SynergySphere API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\n📝 Demo credentials:`);
  console.log(`Email: john@example.com | Password: anything`);
  console.log(`Email: jane@example.com | Password: anything`);
  console.log(`Email: mike@example.com | Password: anything`);
});

export default app;
