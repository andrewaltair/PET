import prisma from '../config/database';
import { UserRole } from 'petservice-marketplace-shared-types';

export interface AdminAnalytics {
  totalUsers: number;
  totalProviders: number;
  totalOwners: number;
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  activeProviders: number;
  pendingVerificationsCount: number;
  recentUsers: {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
  }[];
}

export interface ChartDataPoint {
  date: string;
  bookings: number;
  revenue: number;
}

export interface AdminUserData {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  _count?: {
    services: number;
    bookings: number;
  };
}

export class AdminService {
  /**
   * Get platform analytics
   */
  static async getAnalytics(): Promise<AdminAnalytics> {
    const [
      totalUsers,
      totalProviders,
      totalOwners,
      totalServices,
      totalBookings,
      pendingBookings,
      activeProviders,
      pendingVerificationsCount,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.PROVIDER } }),
      prisma.user.count({ where: { role: UserRole.OWNER } }),
      prisma.service.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.user.count({
        where: {
          role: UserRole.PROVIDER,
          services: {
            some: {},
          },
        },
      }),
      prisma.user.count({
        where: {
          role: UserRole.PROVIDER,
          profile: {
            OR: [
              { bio: null },
              { location: null },
            ],
          },
        },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalProviders,
      totalOwners,
      totalServices,
      totalBookings,
      pendingBookings,
      activeProviders,
      pendingVerificationsCount,
      recentUsers,
    };
  }

  /**
   * Get chart data for analytics
   */
  static async getChartData(days: number = 30): Promise<ChartDataPoint[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        service: {
          select: {
            price: true,
          },
        },
      },
    });

    // Group bookings by date
    const groupedData = new Map<string, { bookings: number; revenue: number }>();

    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt).toISOString().split('T')[0];
      const existing = groupedData.get(date) || { bookings: 0, revenue: 0 };
      groupedData.set(date, {
        bookings: existing.bookings + 1,
        revenue: existing.revenue + Number(booking.service.price),
      });
    });

    // Convert to array and sort by date
    const chartData: ChartDataPoint[] = Array.from(groupedData.entries())
      .map(([date, data]) => ({
        date,
        bookings: data.bookings,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return chartData;
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              services: true,
              bookings: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, newRole: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Delete user (soft delete or hard delete)
   */
  static async deleteUser(userId: string) {
    // Use cascade delete which is configured in schema
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }

  /**
   * Get pending provider verifications
   */
  static async getPendingVerifications() {
    // Note: You'll need to add identityVerificationStatus to your Profile model
    // For now, this returns providers without full profile completion
    const providers = await prisma.user.findMany({
      where: {
        role: UserRole.PROVIDER,
        profile: {
          OR: [
            { bio: null },
            { location: null },
          ],
        },
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            bio: true,
            location: true,
            avatarUrl: true,
          },
        },
      },
    });

    return providers;
  }

  /**
   * Get all services with filters
   */
  static async getAllServices(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.service.count(),
    ]);

    return {
      data: services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all bookings with filters
   */
  static async getAllBookings(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          service: {
            select: {
              id: true,
              title: true,
              serviceType: true,
              price: true,
            },
          },
        },
      }),
      prisma.booking.count(),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

