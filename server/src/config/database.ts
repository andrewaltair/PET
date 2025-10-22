import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma (PostgreSQL) connection successful.');
    return true;
  } catch (error) {
    console.error('❌ Prisma (PostgreSQL) connection failed:', error);
    return false;
  }
};

export const closeConnection = async (): Promise<void> => {
  console.log('Closing Prisma connection...');
  await prisma.$disconnect();
  console.log('Prisma connection closed');
};

export default prisma;

