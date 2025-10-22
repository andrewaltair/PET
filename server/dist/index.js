"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path")); // Убедитесь, что этот импорт есть
// --- Начало отладки ---
const envPath = path_1.default.resolve(process.cwd(), '.env');
console.log(`[DEBUG] Ищем .env файл по пути: ${envPath}`);
const result = dotenv_1.default.config({ path: envPath });
if (result.error) {
    console.error('[DEBUG] ОШИБКА ЗАГРУЗКИ .env:', result.error);
}
else {
    console.log('[DEBUG] .env файл успешно загружен.');
}
// Этот лог — КЛЮЧЕВОЙ.
console.log(`[DEBUG] Значение DATABASE_URL из process.env: ${process.env.DATABASE_URL}`);
// --- Конец отладки ---
// --- Здесь начинаются остальные импорты ---
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const auth_1 = require("./routes/auth");
const profiles_1 = require("./routes/profiles");
const services_1 = require("./routes/services");
const bookings_1 = require("./routes/bookings");
const reviews_1 = require("./routes/reviews");
const conversations_1 = require("./routes/conversations");
const stripe_1 = require("./routes/stripe");
const socketServer_1 = require("./config/socketServer");
const app_1 = require("./config/app");
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
console.log(`[SERVER DEBUG] Пытаемся использовать CORS origin: ${process.env.CORS_ORIGIN}`);
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // <-- ВОТ ИСПРАВЛЕНИЕ
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// Handle preflight OPTIONS requests
app.options('*', (0, cors_1.default)(corsOptions));
// Apply CORS middleware
app.use((0, cors_1.default)(corsOptions));
// Rate limiting (temporarily disabled for testing)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: app_1.appConfig.rateLimitWindowMs,
    max: app_1.appConfig.rateLimitMax,
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
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Compression middleware
app.use((0, compression_1.default)());
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
            url: `http://localhost:${app_1.appConfig.port}/api/v1`,
            description: 'Development server',
        },
        {
            url: `${app_1.appConfig.corsOrigin}/api/v1`,
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Swagger UI endpoint
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Pet Service Marketplace API is healthy',
        timestamp: new Date().toISOString(),
        environment: app_1.appConfig.nodeEnv,
    });
});
// API routes
app.use('/api/v1/auth', auth_1.authRouter);
app.use('/api/v1/profiles', profiles_1.profileRouter);
app.use('/api/v1/services', services_1.serviceRouter);
app.use('/api/v1/bookings', bookings_1.bookingRouter);
app.use('/api/v1/reviews', reviews_1.reviewRouter);
app.use('/api/v1/conversations', conversations_1.conversationRouter);
app.use('/api/v1/stripe', stripe_1.stripeRouter);
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
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        ...(app_1.appConfig.nodeEnv === 'development' && { stack: error.stack }),
    });
});
// Create HTTP server
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.io server
exports.socketServer = new socketServer_1.SocketServer(httpServer);
// Start server
async function startServer() {
    try {
        // Test database connection with Prisma
        console.log('Attempting to connect to database...');
        const dbConnected = await (0, database_1.testConnection)();
        if (!dbConnected) {
            console.error('Database connection failed. Exiting...');
            process.exit(1);
        }
        httpServer.listen(app_1.appConfig.port, () => {
            console.log(`🚀 Pet Service Marketplace API running on port ${app_1.appConfig.port}`);
            console.log(`📝 Environment: ${app_1.appConfig.nodeEnv}`);
            console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN}`);
            console.log(`💬 WebSocket server initialized`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await (0, database_1.closeConnection)();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await (0, database_1.closeConnection)();
    process.exit(0);
});
startServer();
