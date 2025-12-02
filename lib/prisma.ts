import { PrismaClient } from '@prisma/client'

// Prisma client singleton with connection pool management
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool settings for MySQL
  // Prevent connection exhaustion
  connection_limit: 10,
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export { prisma }

