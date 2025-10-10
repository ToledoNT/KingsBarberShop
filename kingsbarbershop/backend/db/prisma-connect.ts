// backend/db/prisma-connect.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Evita múltiplas instâncias durante hot reload
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // opcional
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;