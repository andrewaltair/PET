"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnerRole = exports.requireProviderRole = exports.optionalAuth = exports.authenticateToken = void 0;
const authService_1 = require("../services/authService");
const petservice_marketplace_shared_types_1 = require("petservice-marketplace-shared-types");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required',
            });
            return;
        }
        // Check for mock tokens (for testing when database is not available)
        // Only process mock tokens if they match the expected format
        if (token.startsWith('mock-jwt-token-')) {
            // Extract user info from mock token (format: mock-jwt-token-{userId}-{timestamp})
            const parts = token.split('-');
            if (parts.length >= 5) { // Ensure proper mock token format
                const userId = parts[3] + '-' + parts[4]; // user-1, provider-1, etc.
                let mockUser;
                if (userId === 'user-1') {
                    mockUser = {
                        id: 'user-1',
                        email: 'user@example.com',
                        role: petservice_marketplace_shared_types_1.UserRole.OWNER,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                }
                else if (userId === 'provider-1') {
                    mockUser = {
                        id: 'provider-1',
                        email: 'provider@example.com',
                        role: petservice_marketplace_shared_types_1.UserRole.PROVIDER,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                }
                if (mockUser) {
                    req.user = mockUser;
                    next();
                    return;
                }
            }
            // If mock token format is invalid, fall through to real token verification
        }
        // Verify real JWT token
        const user = await authService_1.AuthService.verifyToken(token);
        if (!user) {
            res.status(403).json({
                success: false,
                error: 'Invalid or expired token',
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during authentication',
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const user = await authService_1.AuthService.verifyToken(token);
            if (user) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        // Silently fail for optional auth
        next();
    }
};
exports.optionalAuth = optionalAuth;
const requireProviderRole = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }
        if (user.role !== 'PROVIDER') {
            res.status(403).json({
                success: false,
                error: 'Only PROVIDER users can access this resource',
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Provider role validation error:', error);
        res.status(500).json({
            success: false,
            error: 'Authorization failed',
        });
    }
};
exports.requireProviderRole = requireProviderRole;
const requireOwnerRole = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }
        if (user.role !== 'OWNER') {
            res.status(403).json({
                success: false,
                error: 'Only OWNER users can access this resource',
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Owner role validation error:', error);
        res.status(500).json({
            success: false,
            error: 'Authorization failed',
        });
    }
};
exports.requireOwnerRole = requireOwnerRole;
