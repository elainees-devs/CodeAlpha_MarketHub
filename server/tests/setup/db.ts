import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// =====================================================
// CONNECT DATABASE
// =====================================================
export async function connectDB() {
  await prisma.$connect();
}

// =====================================================
// CLEAN DATABASE
// =====================================================
export async function cleanDB() {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tables) {
    if (tablename !== "_prisma_migrations") {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
      );
    }
  }
}

// =====================================================
// DISCONNECT DATABASE
// =====================================================
export async function disconnectDB() {
  await prisma.$disconnect();
}