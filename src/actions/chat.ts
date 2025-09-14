"use server";

import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

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
