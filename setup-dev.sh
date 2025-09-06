#!/bin/bash

echo "Setting up SynergySphere Development Environment..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    exit 1
fi
echo "Node.js is installed: $(node --version)"

# Install backend dependencies
echo
echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
fi
echo "Backend dependencies installed."

# Check environment file
echo
echo "Checking environment file..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synergysphere?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="your-super-secret-access-key-here-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-this-in-production"

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
EOF
    echo ".env file created. Please update the DATABASE_URL with your PostgreSQL credentials."
else
    echo ".env file already exists."
fi

# Generate Prisma client
echo
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma client"
    exit 1
fi
echo "Prisma client generated."

# Run database migrations
echo
echo "Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "WARNING: Database migration failed. Please check your DATABASE_URL in .env file."
    echo "Make sure PostgreSQL is running and the database exists."
fi

cd ..

# Install frontend dependencies
echo
echo "Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
fi
echo "Frontend dependencies installed."

# Check frontend environment file
echo
echo "Checking frontend environment file..."
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:3001/api" > .env
    echo "Frontend .env file created."
else
    echo "Frontend .env file already exists."
fi

echo
echo "Setup complete!"
echo
echo "Next steps:"
echo "1. Update backend/.env with your PostgreSQL credentials"
echo "2. Make sure PostgreSQL is running"
echo "3. Run: ./start-dev.sh"
echo

