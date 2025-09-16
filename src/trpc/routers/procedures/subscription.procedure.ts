import { getAuth } from "@/actions/chat";
import { db } from "@/db";
import { subscriptionsTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, gt, eq, sql } from "drizzle-orm";

export const subscriptionRouter = createTRPCRouter({
  getCurrentSubscription: baseProcedure.query(async () => {
    const authData = await getAuth();
    const [currentSubscription] = await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, authData.user.id),
          gt(subscriptionsTable.billingCycleEnd, sql`now()`)
        )
      )
      .limit(1);

    return currentSubscription ?? null;
  }),
});
