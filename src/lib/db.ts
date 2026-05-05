import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

// Resolve DB path from DATABASE_URL env
const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
// Strip "file:" prefix
const dbRelPath = dbUrl.startsWith('file:') ? dbUrl.slice(5) : dbUrl
const dbAbsPath = path.isAbsolute(dbRelPath)
  ? dbRelPath
  : path.join(process.cwd(), dbRelPath)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbAbsPath}` }) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any)
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
