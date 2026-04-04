import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable for Prisma initialization.");
}

const prismaAdapter = new PrismaPg(databaseUrl);

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: prismaAdapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
