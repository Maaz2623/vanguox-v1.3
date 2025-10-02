import {
  convertToModelMessages,
  createIdGenerator,
  smoothStream,
  streamText,
} from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { systemPrompt } from "@/prompt";
import { saveChat, updateChatTitle } from "@/actions/chat";
import { db } from "@/db";
import { usageTable } from "@/db/schema";
import { usageExceeded } from "@/actions/usage";
import { NextResponse } from "next/server";
import {
  addResource,
  appBuilder,
  getInformation,
  imageGenerator,
  webSearcher,
} from "@/ai/tools";

export async function POST(req: Request) {
  const { messages, model, chatId } = await req.json();

  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    throw new Error("Unauthorized");
  }

  const exceeded = await usageExceeded(authData.user.id);

  if (exceeded) {
    return new NextResponse(JSON.stringify({ error: "Token limit exceeded" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const result = streamText({
      model,
      system: `${systemPrompt}`,
      messages: convertToModelMessages(messages),
      experimental_transform: smoothStream({
        chunking: "word",
        delayInMs: 25,
      }),
      maxRetries: 2,
      tools: {
        webSearcher,
        imageGenerator: imageGenerator(model),
        getInformation,
        addResource,
        appBuilder,
      },
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
      originalMessages: messages,
      generateMessageId: createIdGenerator({
        prefix: "msg",
        size: 16,
      }),
      onFinish: async ({ messages: updatedMessages }) => {
        const reversed = [...updatedMessages].reverse();
        const assistantMessage = reversed.find(
          (m) =>
            m.role === "assistant" &&
            m.parts.some((p) => p.type === "text") &&
            m.parts.every(
              (p) => p.type !== "tool-generateImage" || p.output !== undefined
            )
        );

        if (!assistantMessage) return;

        const assistantIndex = updatedMessages.findIndex(
          (m) => m.id === assistantMessage.id
        );
        const userMessage = updatedMessages
          .slice(0, assistantIndex)
          .reverse()
          .find((m) => m.role === "user");

        if (!userMessage) return;

        const usage = await result.usage;

        if (!usage.totalTokens) return;

        await db.insert(usageTable).values({
          tokensUsed: usage.totalTokens,
          userId: authData.user.id,
        });

        await saveChat({
          chatId,
          messages: [userMessage, assistantMessage],
          modelId: model,
        });
        if (messages.length < 2) {
          updateChatTitle({
            chatId,
            messages,
            model,
          });
        }
      },
    });
  }
}
