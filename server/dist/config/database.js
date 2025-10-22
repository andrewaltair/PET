"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.testConnection = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
const testConnection = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Prisma (MySQL) connection successful.');
        return true;
    }
    catch (error) {
        console.error('❌ Prisma (MySQL) connection failed:', error);
        return false;
    }
};
exports.testConnection = testConnection;
const closeConnection = async () => {
    console.log('Closing Prisma connection...');
    await prisma.$disconnect();
    console.log('Prisma connection closed');
};
exports.closeConnection = closeConnection;
exports.default = prisma;
