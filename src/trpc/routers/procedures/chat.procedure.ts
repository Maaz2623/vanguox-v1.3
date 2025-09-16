import { getAuth } from "@/actions/chat";
import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { desc, eq } from "drizzle-orm";
import z from "zod";

export const chatRouter = createTRPCRouter({
  getChatMessages: baseProcedure
    .input(
      z.object({
        chatId: z.string(),
      })
    )
    .query(async ({ input }) => {
      getAuth();

      const messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.chatId, input.chatId));

      if (messages.length === 0) {
        return [];
      }

      return messages;
    }),
  getChats: baseProcedure.query(async () => {
    const authData = await getAuth();

    const chats = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.userId, authData.user.id))
      .orderBy(desc(chatsTable.createdAt));

    return chats;
  }),
});
