import { getAuth } from "@/actions/chat";
import { db } from "@/db";
import { usageTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, eq, gte, lte } from "drizzle-orm";

export const usageRouter = createTRPCRouter({
  getMonthUsage: baseProcedure.query(async () => {
    const authData = await getAuth();

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const usage = await db
      .select()
      .from(usageTable)
      .where(
        and(
          eq(usageTable.userId, authData.user.id),
          gte(usageTable.createdAt, startOfMonth),
          lte(usageTable.createdAt, endOfMonth)
        )
      );

    return usage;
  }),
});
