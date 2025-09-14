"use client";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";
import { MessagesList } from "@/modules/messages/ui/components/messages-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/custom/top-bar";

export const ChatView = () => {
  return (
    <div>
      <MainChat />
    </div>
  );
};

const MainChat = () => {
  const isMobile = useIsMobile();

  return (
    <ScrollArea className="relative h-screen  w-full mx-auto">
      <div className="h-6 bg-gradient-to-b z-50 from-background to-tra w-full absolute top-0 left-0" />
      <MessagesList />
    </ScrollArea>
  );
};
