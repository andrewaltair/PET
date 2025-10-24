import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from './auth';
import { UserRole } from 'petservice-marketplace-shared-types';

/**
 * Admin authentication middleware
 * Combines token authentication with admin role verification
 */
export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First verify the token (this sets req.user)
    await authenticateToken(req, res, () => {
      // After token verification, check admin role
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      if ((user as any).role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: 'Access forbidden. Admin role required.',
        });
        return;
      }

      // User is authenticated and is an admin
      next();
    });
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during admin authentication',
    });
  }
};

