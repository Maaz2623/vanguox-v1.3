"use client";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";
import { MessagesList } from "@/modules/messages/ui/components/messages-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatView = () => {
  return (
    <div>
      <MainChat />
    </div>
  );
};

const MainChat = () => {
  return (
    <ScrollArea className="relative h-screen  w-full mx-auto">
      <div className="h-12 top-0 bg-gradient-to-b via-background/70 from-background to-transparent absolute px-3 left-0 w-full z-100 flex justify-between items-center">
        <div />
        <AnimatedThemeToggler />
      </div>
      <div className="h-6 bg-gradient-to-b z-50 from-background to-tra w-full absolute top-0 left-0" />
      <MessagesList />

      <div className="absolute bottom-0 pb-1.5 left-0 w-full flex bg-gradient-to-b from-transparent to-background">
        <div className="mx-auto w-3/4 flex justify-center items-center">
          <PromptInputWithActions />
        </div>
      </div>
    </ScrollArea>
  );
};
