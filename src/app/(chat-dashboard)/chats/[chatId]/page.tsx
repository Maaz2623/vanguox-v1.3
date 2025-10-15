import { ChatView } from "@/modules/chat/views/chat-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { UIMessage } from "ai";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Chat | Vanguox",
  description: "Start chatting",
};

const ChatIdPage = async ({ params }: Props) => {
  const { chatId } = await params;

  const queryClient = getQueryClient();

  const data = await queryClient.fetchQuery(
    trpc.chats.getChatMessages.queryOptions({
      chatId,
    })
  );

  const previousMessages: UIMessage[] = data.map((m) => m.message) ?? [];

  return <ChatView previousMessages={previousMessages} chatId={chatId} />;
};

export default ChatIdPage;
