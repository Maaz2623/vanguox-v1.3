"use client";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
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
    <div className="relative h-screen  w-full mx-auto">
      <div className="h-12 top-0 absolute left-0 w-full">
        {/* <ThemeTogglerButton /> */}
      </div>
      <div className="h-6 bg-gradient-to-b z-50 from-background to-tra w-full absolute top-0 left-0" />
      <MessagesList />

      <div className="absolute bottom-0 pb-1.5 left-0 w-full flex bg-gradient-to-b from-transparent to-background">
        <div className="mx-auto w-3/4 flex justify-center items-center">
          <PromptInputWithActions />
        </div>
      </div>
    </div>
  );
};
