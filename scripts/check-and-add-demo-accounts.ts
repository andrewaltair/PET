import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkAndAddDemoAccounts() {
  try {
    console.log('🔍 Checking for demo accounts...\n');

    const demoAccounts = [
      {
        email: 'admin@example.com',
        password: 'admin',
        role: 'OWNER' as const,
        firstName: 'Admin',
        lastName: 'User',
        avatarUrl: '/avatars/1a270860bac2c66b434968a3047822e3.webp',
        bio: 'System Administrator',
        location: 'System',
      },
      {
        email: 'user@example.com',
        password: 'user',
        role: 'OWNER' as const,
        firstName: 'Regular',
        lastName: 'User',
        avatarUrl: '/avatars/2b04cc0b930f82afe6c38d3209dcbdfd.webp',
      },
      {
        email: 'provider@example.com',
        password: 'provider',
        role: 'PROVIDER' as const,
        firstName: 'Pet',
        lastName: 'Provider',
        avatarUrl: '/avatars/1c9a4dd0bbd964e3eecbd40caf3b7e37.webp',
        bio: 'Professional pet care provider with 3 years of experience. Specializing in dog walking and pet sitting.',
        location: 'New York, NY',
      },
    ];

    for (const account of demoAccounts) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: account.email },
        include: { profile: true },
      });

      if (existingUser) {
        console.log(`✅ Found existing account: ${account.email}`);
        
        // Update avatar if it doesn't have one or update it
        if (existingUser.profile) {
          await prisma.profile.update({
            where: { id: existingUser.profile.id },
            data: { avatarUrl: account.avatarUrl },
          });
          console.log(`   📸 Updated avatar: ${account.avatarUrl}`);
        } else {
          // Create profile if it doesn't exist
          await prisma.profile.create({
            data: {
              userId: existingUser.id,
              firstName: account.firstName,
              lastName: account.lastName,
              avatarUrl: account.avatarUrl,
              bio: account.bio,
              location: account.location,
            },
          });
          console.log(`   👤 Created profile with avatar: ${account.avatarUrl}`);
        }
      } else {
        console.log(`❌ Account not found: ${account.email}`);
        console.log(`   Please create this account manually or run: npm run db:migrate`);
      }
      
      console.log('');
    }

    // Show all demo accounts
    console.log('📋 Demo Accounts Summary:');
    const demoProfiles = await prisma.profile.findMany({
      where: {
        user: {
          email: {
            in: ['admin@example.com', 'user@example.com', 'provider@example.com'],
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    demoProfiles.forEach((profile) => {
      console.log(`   ${profile.user?.email || 'N/A'} (${profile.user?.role || 'N/A'}): ${profile.avatarUrl || 'No avatar'}`);
    });

    console.log('\n🎉 Demo accounts check completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkAndAddDemoAccounts()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

