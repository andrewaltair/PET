import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { appConfig } from '../config/app';
import { User, UserWithPassword, CreateUserRequest, LoginRequest, AuthResponse, UserRole } from 'petservice-marketplace-shared-types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: CreateUserRequest): Promise<User> {
    const { email, password, role } = userData;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, appConfig.bcryptRounds);

    // Insert user into database
    const user = await prisma.user.create({
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
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      appConfig.jwtSecret,
      { expiresIn: appConfig.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      appConfig.jwtRefreshSecret,
      { expiresIn: appConfig.jwtRefreshExpiresIn }
    );

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
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, appConfig.jwtSecret) as {
        userId: string;
        email: string;
        role: UserRole;
      };

      const user = await this.findUserById(decoded.userId);
      return user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, appConfig.jwtRefreshSecret) as {
        userId: string;
      };

      const user = await this.findUserById(decoded.userId);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const newToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        appConfig.jwtSecret,
        { expiresIn: appConfig.jwtExpiresIn }
      );

      return { token: newToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Find user by email
   */
  private static async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
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

