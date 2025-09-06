const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

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

// Mock authentication endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }
    
    // Mock user creation
    const mockUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Mock tokens
    const accessToken = 'mock_access_token_' + Date.now();
    const refreshToken = 'mock_refresh_token_' + Date.now();
    
    console.log('Registration successful for:', email);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: mockUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }
    
    // Mock user
    const mockUser = {
      id: 'user_' + Date.now(),
      name: 'Test User',
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Mock tokens
    const accessToken = 'mock_access_token_' + Date.now();
    const refreshToken = 'mock_refresh_token_' + Date.now();
    
    console.log('Login successful for:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    // Mock current user
    const mockUser = {
      id: 'user_123',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: mockUser,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Mock other endpoints
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    message: 'Projects retrieved successfully',
    data: [],
  });
});

app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;
  const mockProject = {
    id: 'project_' + Date.now(),
    name,
    description,
    createdBy: 'user_123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberships: [],
    _count: { tasks: 0, messages: 0 }
  };
  
  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: mockProject,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SynergySphere API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

