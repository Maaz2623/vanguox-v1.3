import { ChatView } from "@/modules/chat/views/chat-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { UIMessage } from "ai";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

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
