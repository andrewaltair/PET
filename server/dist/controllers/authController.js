"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    /**
     * POST /api/v1/auth/register
     * Register a new user
     */
    static async register(req, res) {
        try {
            const userData = req.body;
            const user = await authService_1.AuthService.register(userData);
            const response = {
                success: true,
                data: user,
                message: 'User registered successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(400).json(response);
        }
    }
    /**
     * POST /api/v1/auth/login
     * Login user and return JWT tokens
     */
    static async login(req, res) {
        try {
            const credentials = req.body;
            const authResponse = await authService_1.AuthService.login(credentials);
            const response = {
                success: true,
                data: authResponse,
                message: 'Login successful',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(401).json(response);
        }
    }
    /**
     * GET /api/v1/auth/me
     * Get current user information (protected route)
     */
    static async getMe(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                res.status(401).json(response);
                return;
            }
            const response = {
                success: true,
                data: req.user,
                message: 'User information retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get me error:', error);
            const response = {
                success: false,
                error: 'Failed to retrieve user information',
            };
            res.status(500).json(response);
        }
    }
    /**
     * POST /api/v1/auth/refresh
     * Refresh access token using refresh token
     */
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                const response = {
                    success: false,
                    error: 'Refresh token required',
                };
                res.status(400).json(response);
                return;
            }
            const tokenResponse = await authService_1.AuthService.refreshToken(refreshToken);
            const response = {
                success: true,
                data: tokenResponse,
                message: 'Token refreshed successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Refresh token error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(401).json(response);
        }
    }
}
exports.AuthController = AuthController;
