import { PrismaClient } from '@prisma/client';

/**
 * Cliente de Prisma para acceder a la base de datos
 * Se exporta una instancia global en desarrollo para evitar múltiples conexiones
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 