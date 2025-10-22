import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { User, UserRole } from 'petservice-marketplace-shared-types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    if (token.startsWith('mock-jwt-token-')) {
      // Extract user info from mock token (format: mock-jwt-token-{userId}-{timestamp})
      const parts = token.split('-');
      const userId = parts[3] + '-' + parts[4]; // user-1, provider-1, etc.
      let mockUser;
      if (userId === 'user-1') {
        mockUser = {
          id: 'user-1',
          email: 'user@example.com',
          role: UserRole.OWNER,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else if (userId === 'provider-1') {
        mockUser = {
          id: 'provider-1',
          email: 'provider@example.com',
          role: UserRole.PROVIDER,
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

    const user = await AuthService.verifyToken(token);
    if (!user) {
      res.status(403).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await AuthService.verifyToken(token);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

export const requireProviderRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
  } catch (error) {
    console.error('Provider role validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization failed',
    });
  }
};

export const requireOwnerRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
  } catch (error) {
    console.error('Owner role validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization failed',
    });
  }
};

