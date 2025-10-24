import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { appConfig } from '../config/app';
import { User, UserWithPassword, CreateUserRequest, LoginRequest, AuthResponse, UserRole } from 'petservice-marketplace-shared-types';
import { cacheGet, cacheSet, cacheDelete } from '../config/redis';

export class AuthService {
  // ✅ SECURITY FIX: Account lockout constants
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCK_DURATION_SECONDS = 30 * 60; // 30 minutes
  private static readonly ATTEMPT_WINDOW_SECONDS = 15 * 60; // 15 minutes

  /**
   * Get login attempts for email
   */
  private static async getLoginAttempts(email: string): Promise<{ count: number; firstAttempt: number; lockUntil?: number }> {
    try {
      const key = `login_attempts:${email}`;
      const data = await cacheGet(key);
      
      if (!data) {
        return { count: 0, firstAttempt: Date.now() };
      }
      
      return JSON.parse(data);
    } catch (error) {
      // Redis недоступен - возвращаем пустые попытки
      console.warn('Redis unavailable, skipping login attempt tracking:', error);
      return { count: 0, firstAttempt: Date.now() };
    }
  }

  /**
   * Record failed login attempt
   */
  private static async recordFailedAttempt(email: string): Promise<{ count: number; locked: boolean; remainingTime?: number }> {
    try {
      const key = `login_attempts:${email}`;
      const attempts = await this.getLoginAttempts(email);
      
      const now = Date.now();
      
      // Reset if window expired
      if (now - attempts.firstAttempt > this.ATTEMPT_WINDOW_SECONDS * 1000) {
        attempts.count = 1;
        attempts.firstAttempt = now;
        attempts.lockUntil = undefined;
      } else {
        attempts.count += 1;
      }
      
      // Lock account if max attempts reached
      if (attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
        attempts.lockUntil = now + (this.LOCK_DURATION_SECONDS * 1000);
        console.warn(`⚠️ Account locked for ${email} until ${new Date(attempts.lockUntil).toISOString()}`);
      }
      
      // Save to Redis with expiration
      await cacheSet(key, JSON.stringify(attempts), this.LOCK_DURATION_SECONDS);
      
      return {
        count: attempts.count,
        locked: !!attempts.lockUntil,
        remainingTime: attempts.lockUntil ? Math.ceil((attempts.lockUntil - now) / 1000) : undefined,
      };
    } catch (error) {
      // Redis недоступен - просто возвращаем что попытка не удалась
      console.warn('Redis unavailable, skipping failed attempt tracking:', error);
      return {
        count: 0,
        locked: false,
      };
    }
  }

  /**
   * Clear login attempts after successful login
   */
  private static async clearLoginAttempts(email: string): Promise<void> {
    try {
      const key = `login_attempts:${email}`;
      await cacheDelete(key);
    } catch (error) {
      // Redis недоступен - игнорируем ошибку
      console.warn('Redis unavailable, skipping login attempts clear:', error);
    }
  }

  /**
   * Check if account is locked
   */
  private static async isAccountLocked(email: string): Promise<{ locked: boolean; remainingTime?: number }> {
    try {
      const attempts = await this.getLoginAttempts(email);
      
      if (!attempts.lockUntil) {
        return { locked: false };
      }
      
      const now = Date.now();
      
      if (now < attempts.lockUntil) {
        return {
          locked: true,
          remainingTime: Math.ceil((attempts.lockUntil - now) / 1000),
        };
      }
      
      // Lock expired, clear attempts
      await this.clearLoginAttempts(email);
      return { locked: false };
    } catch (error) {
      // Redis недоступен - разрешаем вход без проверки блокировки
      console.warn('Redis unavailable, skipping account lock check:', error);
      return { locked: false };
    }
  }

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

    // Hash password if provided
    const passwordHash = password ? await bcrypt.hash(password, appConfig.bcryptRounds) : null;

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
   * Login user with account lockout protection
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    // ✅ SECURITY FIX: Check if account is locked
    const lockStatus = await this.isAccountLocked(email);
    if (lockStatus.locked) {
      const minutes = Math.ceil(lockStatus.remainingTime! / 60);
      throw new Error(
        `Account is locked due to too many failed login attempts. Try again in ${minutes} minutes.`
      );
    }

    // Find user by email
    const user = await this.findUserByEmail(email);
    if (!user) {
      // Record failed attempt for invalid email
      await this.recordFailedAttempt(email);
      throw new Error('Invalid credentials');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      // ✅ SECURITY FIX: Record failed attempt
      const attempts = await this.recordFailedAttempt(email);
      
      // Inform user about remaining attempts
      const remaining = this.MAX_LOGIN_ATTEMPTS - attempts.count;
      if (remaining > 0 && !attempts.locked) {
        throw new Error(`Invalid credentials. ${remaining} attempts remaining.`);
      } else if (attempts.locked) {
        const minutes = Math.ceil(attempts.remainingTime! / 60);
        throw new Error(
          `Account locked due to too many failed attempts. Try again in ${minutes} minutes.`
        );
      }
    }

    // ✅ SECURITY FIX: Clear failed attempts on successful login
    await this.clearLoginAttempts(email);
    console.log(`✅ Successful login for ${email}`);

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
   * Find user by email (includes password for authentication)
   */
  private static async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({
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
  private static async findUserById(id: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({
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

