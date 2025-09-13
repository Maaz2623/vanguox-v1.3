"use client";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";
import { MessagesList } from "@/modules/messages/ui/components/messages-list";

export const ChatView = () => {
  return (
    <div>
      <MainChat />
    </div>
  );
};

const MainChat = () => {
  return (
    <div className="bg-gray-100 relative h-screen md:w-3/4 lg:w-1/2 w-full mx-auto">
      <MessagesList />

      <div className="bottom-1.5 absolute left-0  w-full">
        <PromptInputWithActions />
      </div>
    </div>
  );
};
