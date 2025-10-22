import dotenv from 'dotenv';
import path from 'path'; // Убедитесь, что этот импорт есть

// --- Начало отладки ---
const envPath = path.resolve(process.cwd(), '..', '.env');
console.log(`[DEBUG] Ищем .env файл по пути: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('[DEBUG] ОШИБКА ЗАГРУЗКИ .env:', result.error);
} else {
  console.log('[DEBUG] .env файл успешно загружен.');
}

// Этот лог — КЛЮЧЕВОЙ.
console.log(`[DEBUG] Значение DATABASE_URL из process.env: ${process.env.DATABASE_URL}`);
// --- Конец отладки ---


// --- Здесь начинаются остальные импорты ---
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profiles';
import { serviceRouter } from './routes/services';
import { bookingRouter } from './routes/bookings';
import { reviewRouter } from './routes/reviews';
import { conversationRouter } from './routes/conversations';
import { stripeRouter } from './routes/stripe';
import { SocketServer } from './config/socketServer';
import { appConfig } from './config/app';
import { testConnection, closeConnection } from './config/database';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
console.log(`[SERVER DEBUG] Пытаемся использовать CORS origin: ${appConfig.corsOrigin}`);

const corsOptions = {
  origin: appConfig.corsOrigin, // <-- ИСПРАВЛЕНИЕ: используем appConfig вместо process.env
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200, // для некоторых браузеров
};

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Apply CORS middleware
app.use(cors(corsOptions));

// Rate limiting (temporarily disabled for testing)
const limiter = rateLimit({
  windowMs: appConfig.rateLimitWindowMs,
  max: appConfig.rateLimitMax,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting (temporarily disabled for testing)
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Pet Service Marketplace API',
    version: '1.0.0',
    description: 'Comprehensive API for pet service marketplace platform',
    contact: {
      name: 'API Support',
      email: 'support@petservice-marketplace.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${appConfig.port}/api/v1`,
      description: 'Development server',
    },
    {
      url: `${appConfig.corsOrigin}/api/v1`,
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
          },
          data: {
            description: 'Response data (varies by endpoint)',
          },
          error: {
            type: 'string',
            description: 'Error message if request failed',
          },
          message: {
            type: 'string',
            description: 'Success message',
          },
        },
        required: ['success'],
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            description: 'Array of items',
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                description: 'Current page number',
              },
              limit: {
                type: 'integer',
                description: 'Items per page',
              },
              total: {
                type: 'integer',
                description: 'Total number of items',
              },
              totalPages: {
                type: 'integer',
                description: 'Total number of pages',
              },
            },
            required: ['page', 'limit', 'total', 'totalPages'],
          },
        },
        required: ['data', 'pagination'],
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Pet Service Marketplace API is healthy',
    timestamp: new Date().toISOString(),
    environment: appConfig.nodeEnv,
  });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/conversations', conversationRouter);
app.use('/api/v1/stripe', stripeRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(appConfig.nodeEnv === 'development' && { stack: error.stack }),
  });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io server
export const socketServer = new SocketServer(httpServer);

// Start server
async function startServer() {
  try {
    // Test database connection with Prisma
    console.log('Attempting to connect to database...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Database connection failed. Exiting...');
      process.exit(1);
    }

    httpServer.listen(appConfig.port, () => {
      console.log(`🚀 Pet Service Marketplace API running on port ${appConfig.port}`);
      console.log(`📝 Environment: ${appConfig.nodeEnv}`);
      console.log(`🔗 CORS Origin: ${appConfig.corsOrigin}`);
      console.log(`💬 WebSocket server initialized`);
      console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'Connected'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await closeConnection();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await closeConnection();
  process.exit(0);
});

startServer();

