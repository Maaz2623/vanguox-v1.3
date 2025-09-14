import { getAuth } from "@/actions/chat";
import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const chatRouter = createTRPCRouter({
  getChats: baseProcedure.query(async () => {
    const authData = await getAuth();

    const chats = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, authData.user.id));

    return chats;
  }),
});
