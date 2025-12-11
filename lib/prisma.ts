import { PrismaClient } from '@prisma/client';

/**
 * Prisma Database Client
 *
 * DATABASE_URL is validated in lib/env.ts
 * Prisma reads it automatically from environment variables
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
