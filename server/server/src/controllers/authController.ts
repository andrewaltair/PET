import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CreateUserRequest, LoginRequest, ApiResponse } from 'petservice-marketplace-shared-types';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      const user = await AuthService.register(userData);

      const response: ApiResponse<typeof user> = {
        success: true,
        data: user,
        message: 'User registered successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Registration failed';

      const response: ApiResponse = {
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
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequest = req.body;
      const authResponse = await AuthService.login(credentials);

      const response: ApiResponse<typeof authResponse> = {
        success: true,
        data: authResponse,
        message: 'Login successful',
      };

      res.json(response);
    } catch (error) {
      console.error('Login error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      const response: ApiResponse = {
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
  static async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not authenticated',
        };
        res.status(401).json(response);
        return;
      }

      const response: ApiResponse<typeof req.user> = {
        success: true,
        data: req.user,
        message: 'User information retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get me error:', error);

      const response: ApiResponse = {
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
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          error: 'Refresh token required',
        };
        res.status(400).json(response);
        return;
      }

      const tokenResponse = await AuthService.refreshToken(refreshToken);

      const response: ApiResponse<typeof tokenResponse> = {
        success: true,
        data: tokenResponse,
        message: 'Token refreshed successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Refresh token error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(401).json(response);
    }
  }
}

