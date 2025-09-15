import { ChatView } from "@/modules/chat/views/chat-view";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async ({ params }: Props) => {
  const { chatId } = await params;

  return <ChatView chatId={chatId} />;
};

export default ChatIdPage;
