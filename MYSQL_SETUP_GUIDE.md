# MySQL Database Setup Guide 🐬

## Problem Summary

The login is failing with a "Network Error" because:
1. The server can't find the `.env` file with database credentials
2. MySQL database might not be running
3. Database migrations haven't been run

## Quick Fix Steps

### Step 1: Create `.env` File

Create a `.env` file in the **root directory** of your project with this content:

```env
# Database Configuration
DATABASE_URL="mysql://petuser:petpass@localhost:3306/petservice_marketplace"

# JWT Configuration
JWT_SECRET="concept-jwt-secret-key-for-demo-only"
JWT_REFRESH_SECRET="concept-refresh-secret-key-for-demo-only"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Bcrypt Configuration
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Step 2: Start MySQL Database

**Option A: Using Docker (Recommended)**
```bash
docker-compose up mysql -d
```

**Option B: If MySQL is already installed locally**
Make sure MySQL is running on port 3306. You can check with:
```bash
# Windows PowerShell
Get-Process -Name mysqld

# Or check the port
netstat -ano | findstr :3306
```

### Step 3: Run Database Migrations

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Step 4: Seed Test Users

Create test users in the database:

```bash
# Option 1: Using MySQL command line
mysql -u petuser -ppetpass petservice_marketplace < ../scripts/create-test-users.sql

# Option 2: Using Docker MySQL
docker exec -i petservice_marketplace-mysql-1 mysql -u petuser -ppetpass petservice_marketplace < scripts/create-test-users.sql
```

**Test users that will be created:**
- Email: `testowner@test.com`, Password: `password123` (OWNER)
- Email: `owner@test.com`, Password: `password123` (OWNER)
- Email: `provider@test.com`, Password: `password123` (PROVIDER)

### Step 5: Restart the Server

```bash
# From the root directory
cd server
npm run dev
```

Or use the restart script:
```bash
# From the root directory
.\hard-restart.bat
```

## Verify Setup

### Check if MySQL is Running

```bash
# Check Docker containers
docker ps

# Should see MySQL container running
```

### Check Database Connection

```bash
cd server
npm run dev
```

Look for this in the console:
```
✅ Prisma (MySQL) connection successful.
```

### Test Login

1. Go to http://localhost:3000/en/login
2. Use credentials:
   - Email: `testowner@test.com`
   - Password: `password123`
3. Click "Sign in"

## Troubleshooting

### Error: "Cannot connect to MySQL"

**Solution:**
```bash
# Check if MySQL container is running
docker ps | grep mysql

# If not running, start it
docker-compose up mysql -d

# Check logs
docker logs petservice_marketplace-mysql-1
```

### Error: "Unknown database 'petservice_marketplace'"

**Solution:**
```bash
# Database might not exist, run migrations
cd server
npx prisma migrate dev
```

### Error: "Network Error" in browser

**Solution:**
1. Check if server is running on port 3001
2. Check browser console for CORS errors
3. Verify `.env` file exists and has correct CORS_ORIGIN

### Error: "Migration failed"

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
cd server
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

## Alternative: Use Without Database (Mock Mode)

If you just want to test the UI without setting up MySQL:

The project supports mock authentication. Simply start without the database:

```bash
# Just start the client
cd client
npm run dev
```

Then access the site and the login will use mock data.

## Summary

1. ✅ Create `.env` file with MySQL connection string
2. ✅ Start MySQL database (docker-compose)
3. ✅ Run Prisma migrations
4. ✅ Seed test users
5. ✅ Restart server
6. ✅ Test login with `testowner@test.com` / `password123`

Once these steps are complete, the login should work! 🎉

