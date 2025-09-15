import {
  convertToModelMessages,
  createIdGenerator,
  smoothStream,
  streamText,
} from "ai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { systemPrompt } from "@/prompt";
import { saveChat } from "@/actions/chat";

export async function POST(req: Request) {
  const { messages, model, chatId } = await req.json();

  console.log(chatId);

  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    throw new Error("Unauthorized");
  }

  const result = streamText({
    model,
    system: `${systemPrompt}`,
    messages: convertToModelMessages(messages),
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 25,
    }),
    // tools: {
    //   webSearcher,
    //   imageGenerator: imageGenerator(model),
    //   getInformation,
    //   addResource,
    // },
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
      await saveChat({
        chatId,
        messages: [userMessage, assistantMessage],
        modelId: model,
      });
    },
  });
}
