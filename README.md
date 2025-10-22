# Pet Service Marketplace 🐾

A full-stack web application that connects pet owners with trusted service providers. Built with Next.js, Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **Dual User Roles**: Pet Owners (OWNER) and Service Providers (PROVIDER)
- **JWT Authentication**: Secure login and registration system
- **Service Categories**: Walking, Sitting, Grooming, Veterinary visits, Taxi, Training
- **End-to-End Type Safety**: TypeScript throughout the entire stack
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe backend code
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Shared
- **Custom TypeScript types** - End-to-end type safety
- **Zod schemas** - Runtime validation

## Project Structure

```
petservice-marketplace/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── services/      # API client functions
│   │   └── utils/         # Utility functions
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Backend utilities
│   │   └── config/        # Configuration files
├── shared-types/           # Shared TypeScript types
│   ├── src/
│   │   ├── types/         # Type definitions
│   │   ├── enums/         # Enum definitions
│   │   └── schemas/       # Zod validation schemas
├── config/                 # Database schemas and config
├── scripts/               # Database migration scripts
└── package.json           # Workspace configuration
```

## Prerequisites

- **Node.js** 18.0.0 or higher
- **PostgreSQL** 15.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)

## Getting Started

### Quick Start (Concept Demo)

Choose your preferred way to run the concept:

#### 🚀 Option 0: Instant Demo (No Database Required)
```bash
npm run dev
```
This starts the frontend with **mock authentication** - you can login immediately with test accounts!

**To see test accounts:** Run `npm run test:concept`

**To run with real database:** Use `npm run dev:full` after setting up PostgreSQL.

#### 🚀 Option 1: Docker (Easiest)
```bash
docker-compose up --build
```
This will automatically set up everything in containers!

#### 🐧 Option 2: Linux/Mac Script
```bash
./scripts/setup-concept.sh
```

#### 🪟 Option 3: Windows Script
```powershell
.\scripts\setup-concept.ps1
```

#### 🔧 Option 4: Manual Setup
Follow the manual setup steps below.

All options will:
- ✅ Set up PostgreSQL database
- ✅ Install dependencies
- ✅ Run migrations with test data
- ✅ Start both frontend (http://localhost:3000) and backend servers

Then visit http://localhost:3000 and login with test accounts!

### Manual Setup

```bash
git clone <repository-url>
cd petservice-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Create a PostgreSQL database and update the connection settings:

```sql
-- Create database
CREATE DATABASE petservice_marketplace;

-- Create user (optional)
CREATE USER petservice_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE petservice_marketplace TO petservice_user;
```

### 4. Environment Configuration

Create environment files:

**For the server (.env in server/ directory):**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=petservice_marketplace
DB_USER=postgres
DB_PASSWORD=your_password

# Application Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**For the client (.env.local in client/ directory):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 5. Initialize Database

```bash
# Run database migration
npm run db:migrate

# Or initialize with sample data
npm run db:init
```

### 6. Start Development Servers

```bash
# Start both client and server concurrently
npm run dev

# Or start individually:
# Terminal 1 - Start server
npm run dev --workspace=server

# Terminal 2 - Start client
npm run dev --workspace=client
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: Check `/health` endpoint

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)
- `POST /api/v1/auth/refresh` - Refresh access token

### Services (Coming Soon)
- `GET /api/v1/services` - List services
- `POST /api/v1/services` - Create service (providers only)
- `PUT /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service

### Bookings (Coming Soon)
- `GET /api/v1/bookings` - List user bookings
- `POST /api/v1/bookings` - Create booking (owners only)
- `PUT /api/v1/bookings/:id` - Update booking status

## Database Schema

### Core Tables

- **users**: User accounts with roles (OWNER/PROVIDER)
- **profiles**: Extended user information
- **services**: Service listings from providers
- **bookings**: Service bookings between owners and providers

### Enums

- **user_role**: OWNER, PROVIDER
- **service_type**: WALKING, SITTING, GROOMING, VETERINARIAN_VISIT, TAXI, TRAINING
- **booking_status**: PENDING, CONFIRMED, CANCELLED, COMPLETED

## Development Scripts

```bash
# Install dependencies for all workspaces
npm install

# Database operations
npm run db:migrate   # Run database migrations with test data

# Start development servers
npm run dev          # Start both client and server concurrently

# Individual workspace commands
npm run dev --workspace=client    # Start only client
npm run dev --workspace=server    # Start only server

# Build all workspaces
npm run build

# Run linting
npm run lint

# Run tests (when implemented)
npm run test
```

## Testing the Application

### Test Accounts (Ready to Use)

**Mock Mode (Option 0):** Available immediately after starting the client.

**Database Mode (Options 1-4):** Available after running `npm run db:migrate`.

Test accounts for both modes:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@example.com` | `admin` | OWNER | System administrator account |
| `user@example.com` | `user` | OWNER | Regular pet owner account |
| `provider@example.com` | `provider` | PROVIDER | Pet service provider with sample services |

### Quick Test Steps

1. **Start the application**: `npm run dev`
2. **Login with test account**: Use any of the accounts above
3. **Explore dashboard**: See role-specific features
4. **Browse services**: Provider account has sample pet services

### Manual Testing

You can also create new accounts:
1. **Register as Owner**: Create account with role "OWNER"
2. **Register as Provider**: Create account with role "PROVIDER"
3. **Login**: Use your new account to access dashboard

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong, unique JWT secrets
- Configure production database
- Set secure CORS origins

### Database
- Use connection pooling
- Enable SSL connections
- Set up database backups
- Configure database monitoring

### Security
- Enable HTTPS
- Set secure cookie settings
- Implement rate limiting
- Add input sanitization
- Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Happy coding! 🐾**
