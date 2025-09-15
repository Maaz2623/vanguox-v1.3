"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { UIMessage } from "ai";
import { inArray } from "drizzle-orm";

export const getAuth = async () => {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    throw new Error("Unauthorized");
  }

  return authData;
};

export const createChat = async () => {
  const auth = await getAuth();

  const [newChat] = await db
    .insert(chatsTable)
    .values({
      userId: auth.user.id,
    })
    .returning();

  return newChat;
};

export async function saveChat({
  chatId,
  messages,
  modelId,
}: {
  chatId: string;
  messages: UIMessage[];
  modelId: string;
}) {
  try {
    console.log("Saving chat...");
    const ids = messages.map((m) => m.id);

    // Get existing message IDs from the DB
    const existing = await db
      .select({ id: messagesTable.id })
      .from(messagesTable)
      .where(inArray(messagesTable.id, ids));

    const existingIds = new Set(existing.map((e) => e.id));

    // Filter out already-saved messages
    const newMessagesToInsert = messages.filter(
      (msg) => !existingIds.has(msg.id)
    );

    if (newMessagesToInsert.length === 0) return [];

    const newMessages = await db
      .insert(messagesTable)
      .values(
        newMessagesToInsert.map((msg) => ({
          id: msg.id,
          message: msg, // no need to spread id into message again
          chatId,
          modelId: modelId,
        }))
      )
      .returning();

    console.log("messages saved.");
    return newMessages;
  } catch (error) {
    console.error("Failed to save chat:", error);
    return [];
  }
}
