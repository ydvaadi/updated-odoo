@echo off
echo Setting up SynergySphere Development Environment...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo Node.js is installed.

echo.
echo Installing backend dependencies...
cd backend
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo Backend dependencies installed.

echo.
echo Checking environment file...
if not exist .env (
    echo Creating .env file...
    echo # Database > .env
    echo DATABASE_URL="postgresql://username:password@localhost:5432/synergysphere?schema=public" >> .env
    echo. >> .env
    echo # JWT Secrets >> .env
    echo JWT_ACCESS_SECRET="your-super-secret-access-key-here-change-this-in-production" >> .env
    echo JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-this-in-production" >> .env
    echo. >> .env
    echo # JWT Expiration >> .env
    echo JWT_ACCESS_EXPIRES_IN="15m" >> .env
    echo JWT_REFRESH_EXPIRES_IN="7d" >> .env
    echo. >> .env
    echo # Server >> .env
    echo PORT=3001 >> .env
    echo NODE_ENV="development" >> .env
    echo. >> .env
    echo # CORS >> .env
    echo FRONTEND_URL="http://localhost:5173" >> .env
    echo. >> .env
    echo # Rate Limiting >> .env
    echo RATE_LIMIT_WINDOW_MS=900000 >> .env
    echo RATE_LIMIT_MAX_REQUESTS=100 >> .env
    echo .env file created. Please update the DATABASE_URL with your PostgreSQL credentials.
) else (
    echo .env file already exists.
)

echo.
echo Generating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo Prisma client generated.

echo.
echo Running database migrations...
npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo WARNING: Database migration failed. Please check your DATABASE_URL in .env file.
    echo Make sure PostgreSQL is running and the database exists.
)

cd ..

echo.
echo Installing frontend dependencies...
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo Frontend dependencies installed.

echo.
echo Checking frontend environment file...
if not exist .env (
    echo Creating frontend .env file...
    echo VITE_API_URL=http://localhost:3001/api > .env
    echo Frontend .env file created.
) else (
    echo Frontend .env file already exists.
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Update backend/.env with your PostgreSQL credentials
echo 2. Make sure PostgreSQL is running
echo 3. Run: start-dev.bat
echo.
pause

