import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { appConfig } from '../config/app';
import { User, AuthResponse, UserRole } from 'petservice-marketplace-shared-types';

export type OAuthProvider = 'google' | 'facebook' | 'instagram';

export interface OAuthProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}

export class OAuthService {
  /**
   * Handle OAuth login/registration
   */
  static async handleOAuth(provider: OAuthProvider, profile: OAuthProfile, role: UserRole = UserRole.OWNER): Promise<AuthResponse> {
    // Check if user exists by OAuth provider and ID
    let user = await this.findUserByOAuth(provider, profile.id);

    if (!user) {
      // Check if user exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (existingUser) {
        // Link OAuth to existing account
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            oauthProvider: provider,
            oauthId: profile.id,
          } as any, // Type assertion until Prisma client is regenerated
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: profile.email,
            oauthProvider: provider,
            oauthId: profile.id,
            role,
          } as any, // Type assertion until Prisma client is regenerated
        });

        // Create profile with OAuth data
        await prisma.profile.create({
          data: {
            userId: user.id,
            firstName: profile.firstName || profile.name?.split(' ')[0],
            lastName: profile.lastName || profile.name?.split(' ').slice(1).join(' '),
            avatarUrl: profile.picture,
          },
        });
      }
    }

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    // Generate tokens
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      appConfig.jwtSecret as string,
      { expiresIn: appConfig.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      appConfig.jwtRefreshSecret as string,
      { expiresIn: appConfig.jwtRefreshExpiresIn }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };
  }

  /**
   * Find user by OAuth provider and ID
   */
  private static async findUserByOAuth(provider: OAuthProvider, oauthId: string): Promise<any | null> {
    const user = await prisma.user.findFirst({
      where: {
        oauthProvider: provider,
        oauthId: oauthId,
      } as any, // Type assertion until Prisma client is regenerated
    });

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Verify and extract OAuth profile from JWT
   */
  static verifyOAuthToken(token: string): OAuthProfile | null {
    try {
      const decoded = jwt.verify(token, appConfig.jwtSecret) as OAuthProfile;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

