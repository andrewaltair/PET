"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const app_1 = require("../config/app");
class AuthService {
    /**
     * Register a new user
     */
    static async register(userData) {
        const { email, password, role } = userData;
        // Check if user already exists
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, app_1.appConfig.bcryptRounds);
        // Insert user into database
        const user = await database_1.default.user.create({
            data: {
                email,
                password: passwordHash,
                role,
            },
        });
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Login user
     */
    static async login(credentials) {
        const { email, password } = credentials;
        // Find user by email
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Verify password
        if (!user.passwordHash) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        // Generate tokens
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, app_1.appConfig.jwtSecret, { expiresIn: app_1.appConfig.jwtExpiresIn });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, app_1.appConfig.jwtRefreshSecret, { expiresIn: app_1.appConfig.jwtRefreshExpiresIn });
        // Update last login (optional, can be added to schema later)
        // await this.updateLastLogin(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
            refreshToken,
        };
    }
    /**
     * Verify JWT token and return user
     */
    static async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, app_1.appConfig.jwtSecret);
            const user = await this.findUserById(decoded.userId);
            return user ? {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            } : null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Refresh access token using refresh token
     */
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, app_1.appConfig.jwtRefreshSecret);
            const user = await this.findUserById(decoded.userId);
            if (!user) {
                throw new Error('Invalid refresh token');
            }
            const newToken = jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email,
                role: user.role
            }, app_1.appConfig.jwtSecret, { expiresIn: app_1.appConfig.jwtExpiresIn });
            return { token: newToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    /**
     * Find user by email (includes password for authentication)
     */
    static async findUserByEmail(email) {
        const user = await database_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true, // Explicitly select password field (maps to password_hash in database)
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            passwordHash: user.password, // Map database field to consistent interface name
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Find user by ID (includes password for token verification)
     */
    static async findUserById(id) {
        const user = await database_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                password: true, // Explicitly select password field (maps to password_hash in database)
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            passwordHash: user.password, // Map database field to consistent interface name
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    /**
     * Get user by ID (public method, excludes password)
     */
    static async getUserById(id) {
        const user = await database_1.default.user.findUnique({
            where: { id },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.AuthService = AuthService;
