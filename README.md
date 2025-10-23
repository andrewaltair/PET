# 🐾 Pet Service Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack web application connecting pet owners with trusted service providers. Built with modern technologies for optimal performance, security, and user experience.

## ✨ Features

### 🎯 Core Functionality
- **Dual User Roles**: Pet Owners (OWNER) and Service Providers (PROVIDER)
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Service Management**: Complete CRUD operations for pet services
- **Multilingual Support**: Georgian, English, and Russian languages
- **Real-time Chat**: Live chat functionality for communication
- **Payment Integration**: Stripe payment processing
- **Responsive Design**: Mobile-first responsive UI

### 🛠️ Service Categories
- 🐕 Pet Walking
- 🏠 Pet Sitting
- ✂️ Grooming
- 🏥 Veterinary Visits
- 🚕 Pet Taxi
- 🎓 Training

### 📱 Additional Features
- **Dashboard**: Role-specific dashboards for owners and providers
- **Service Discovery**: Advanced search and filtering
- **Booking System**: Complete booking and payment flow
- **Profile Management**: Comprehensive user profiles with avatars
- **Reviews & Ratings**: Service provider reviews and ratings
- **Notifications**: Real-time notifications
- **Blog**: Pet care tips and news

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **Zustand** - Client state management
- **next-intl** - Internationalization
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Stripe** - Payment processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **Prisma** - ORM for database
- **PostgreSQL/MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Redis** - Caching (optional)
- **Stripe** - Payment processing
- **Zod** - Schema validation

### DevOps & Tools
- **Docker** - Containerization
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Workspaces** - Monorepo management

## 📁 Project Structure

```
pet-service-marketplace/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── api/           # API routes
│   │   ├── lib/           # Utility functions
│   │   └── messages/      # Translation files
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                 # Express.js backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utilities
│   ├── prisma/            # Prisma schema and migrations
│   └── package.json
│
├── shared-types/           # Shared TypeScript types
│   ├── src/
│   │   ├── types/         # Type definitions
│   │   ├── enums/         # Enum definitions
│   │   └── schemas/       # Zod schemas
│   └── package.json
│
├── config/                 # Configuration files
├── scripts/               # Database and utility scripts
├── docker-compose.yml     # Docker configuration
└── package.json           # Workspace root

```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL 15+** or **MySQL 8.0+**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pet-service-marketplace.git
   cd pet-service-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in root and `server/` directory:
   
   **Root `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/petservice_marketplace"
   ```
   
   **Server `.env` (server/.env):**
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/petservice_marketplace"
   
   # Server
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5000
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Security
   BCRYPT_ROUNDS=12
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   
   # Stripe (optional)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
   
   **Client `.env.local` (client/.env.local):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Set up the database**
   ```bash
   # Using PostgreSQL
   createdb petservice_marketplace
   
   # Or using MySQL
   mysql -u root -p -e "CREATE DATABASE petservice_marketplace;"
   ```

5. **Run database migrations**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   cd ..
   ```

6. **Start the development servers**
   ```bash
   # Start both client and server
   npm run dev:full
   
   # Or start individually:
   # Terminal 1 - Server
   npm run dev --workspace=server
   
   # Terminal 2 - Client
   npm run dev --workspace=client
   ```

7. **Access the application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- PostgreSQL database
- Redis cache (optional)
- Backend server
- Frontend application

## 🧪 Testing

### Test Accounts

**Owner Account:**
- Email: `testowner@test.com`
- Password: `password123`

**Provider Account:**
- Email: `testprovider@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin`

### Running Tests

```bash
# Run all tests
npm run test

# Run client tests
npm run test --workspace=client

# Run server tests
npm run test --workspace=server
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |

### Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/services` | List services | No |
| GET | `/api/v1/services/:id` | Get service details | No |
| POST | `/api/v1/services` | Create service | Yes (Provider) |
| PUT | `/api/v1/services/:id` | Update service | Yes (Provider) |
| DELETE | `/api/v1/services/:id` | Delete service | Yes (Provider) |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/bookings` | List user bookings | Yes |
| POST | `/api/v1/bookings` | Create booking | Yes (Owner) |
| PUT | `/api/v1/bookings/:id` | Update booking | Yes |
| DELETE | `/api/v1/bookings/:id` | Cancel booking | Yes |

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start client only
npm run dev:full         # Start both client and server
npm run dev --workspace=client    # Start client
npm run dev --workspace=server    # Start server

# Build
npm run build            # Build all workspaces
npm run build --workspace=client  # Build client
npm run build --workspace=server  # Build server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Linting
npm run lint             # Lint all workspaces
npm run lint --workspace=client   # Lint client
npm run lint --workspace=server   # Lint server

# Type checking
npm run type-check       # Type check client
```

### Code Structure

- **Components**: Reusable React components in `client/src/components/`
- **Pages**: Next.js pages in `client/src/app/[locale]/`
- **API Routes**: Backend API in `server/src/routes/`
- **Services**: Business logic in `server/src/services/`
- **Middleware**: Express middleware in `server/src/middleware/`
- **Types**: Shared types in `shared-types/src/`

## 🌍 Internationalization

The application supports three languages:
- 🇬🇪 Georgian (ka)
- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)

Translation files are located in `client/src/messages/`.

### Adding a New Language

1. Create a new JSON file in `client/src/messages/`
2. Copy structure from existing translation files
3. Add translations
4. Update `client/src/i18n.ts` to include the new locale

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 12 rounds
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schema validation
- **CORS**: Configured for allowed origins
- **Helmet**: Security headers
- **SQL Injection Protection**: Prisma ORM

## 📊 Database Schema

### Core Tables

- **users**: User accounts with roles
- **profiles**: Extended user information
- **services**: Service listings
- **bookings**: Service bookings
- **reviews**: Service reviews
- **payments**: Payment records

### Relationships

- Users → Profiles (1:1)
- Users → Services (1:many)
- Users → Bookings (1:many as owner/provider)
- Services → Bookings (1:many)
- Services → Reviews (1:many)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the great ORM
- Tailwind CSS for the utility-first approach
- All open-source contributors

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Contact: your.email@example.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Service provider verification
- [ ] Payment disputes resolution
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Service categories expansion
- [ ] Multi-currency support

---

**Made with ❤️ for pet lovers**
