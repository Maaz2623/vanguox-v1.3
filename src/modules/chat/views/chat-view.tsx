"use client";
import { MessagesList } from "@/modules/messages/ui/components/messages-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { useChatIdStore } from "@/hooks/chat-id-store";
import { ChatInput } from "@/components/custom/chat-input";
import { TopBar } from "@/components/custom/top-bar";

interface Props {
  chatId: string;
}

export const ChatView = ({ chatId }: Props) => {
  const isMobile = useIsMobile();

  const { chatId: chatStoreId, setChatId } = useChatIdStore();

  useEffect(() => {
    if (chatId !== chatStoreId) {
      setChatId(chatId);
    }
  });

  return (
    <ScrollArea className="relative h-screen  w-full mx-auto">
      <TopBar />
      <div className="h-6 bg-gradient-to-b z-50 from-background to-tra w-full absolute top-0 left-0" />
        <MessagesList chatId={chatId} />
    </ScrollArea>
  );
};
