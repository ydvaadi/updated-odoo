# Debug Sign-up Issues

## Quick Debugging Steps

### 1. Check Backend Environment
```bash
cd backend
node check-env.js
```

### 2. Test Backend API Directly
```bash
cd backend
node test-auth.js
```

### 3. Check Backend Logs
Make sure the backend is running and check for any error messages:
```bash
cd backend
npm run dev
```

### 4. Check Frontend Console
Open browser developer tools and check the Console and Network tabs for errors.

## Common Issues and Solutions

### Issue 1: Database Connection
**Symptoms**: Backend crashes or returns 500 errors
**Solution**: 
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in backend/.env
3. Run: `npx prisma migrate dev`

### Issue 2: CORS Errors
**Symptoms**: Network errors in browser console
**Solution**: 
1. Check FRONTEND_URL in backend/.env
2. Ensure frontend is running on the correct port

### Issue 3: JWT Secret Issues
**Symptoms**: Token generation errors
**Solution**: 
1. Set strong JWT secrets in backend/.env
2. Ensure secrets are at least 32 characters long

### Issue 4: Validation Errors
**Symptoms**: 400 errors with validation messages
**Solution**: 
1. Check that all required fields are provided
2. Ensure email format is valid
3. Ensure password is at least 8 characters

### Issue 5: Network Connectivity
**Symptoms**: Connection refused or timeout errors
**Solution**: 
1. Ensure backend is running on port 3001
2. Check if port is already in use
3. Try accessing http://localhost:3001/api/health

## Step-by-Step Debugging

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Look for: "🚀 SynergySphere API server running on port 3001"

2. **Test Health Endpoint**:
   Open: http://localhost:3001/api/health
   Should return: {"success":true,"message":"SynergySphere API is running"}

3. **Test Registration Endpoint**:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

4. **Check Frontend**:
   - Open browser dev tools
   - Go to Network tab
   - Try to sign up
   - Look for the registration request and response

5. **Check Database**:
   ```bash
   cd backend
   npx prisma studio
   ```
   This will open a database browser to check if users are being created.

## Environment Setup

### Backend .env file should contain:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/synergysphere?schema=public"
JWT_ACCESS_SECRET="your-super-secret-access-key-here-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-change-this-in-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend .env file should contain:
```env
VITE_API_URL=http://localhost:3001/api
```

## Database Setup

If database is not set up:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

## Still Having Issues?

1. Check the exact error message in browser console
2. Check backend terminal for error logs
3. Verify all environment variables are set
4. Ensure database is accessible
5. Try the test scripts provided above

