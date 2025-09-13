import { auth } from "@/lib/auth/auth";
import { systemPrompt } from "@/prompt";
import {
  convertToModelMessages,
  createIdGenerator,
  smoothStream,
  streamText,
} from "ai";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const { messages, model, chatId } = await req.json();

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
  });
}
