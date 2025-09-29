"use server";

import { db } from "@/db";
import { getAuth } from "./chat";
import { subscriptionsTable, usageTable } from "@/db/schema";
import { and, eq, gt, gte, lte, sql } from "drizzle-orm";

export async function usageExceeded(userId: string) {
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

  const now = new Date();

  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
  );
  const endOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59)
  );

  const [result] = await db
    .select({
      totalTokens: sql<number>`coalesce(sum(${usageTable.tokensUsed}), 0)`,
    })
    .from(usageTable)
    .where(
      and(
        eq(usageTable.userId, authData.user.id),
        gte(usageTable.createdAt, startOfMonth),
        lte(usageTable.createdAt, endOfMonth)
      )
    );

  if (currentSubscription) {
    return result.totalTokens <= currentSubscription.maxTokens ? false : true;
  } else {
    return result.totalTokens <= 15000 ? false : true;
  }
}
