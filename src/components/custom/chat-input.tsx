"use client";

import { usePathname } from "next/navigation";
import { PromptInputWithActions } from "./prompt-input-with-actions";
import { cn } from "@/lib/utils";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useState } from "react";
import { useChatStore } from "@/hooks/chat-store";
import { useChat } from "@ai-sdk/react";

const suggestionsList = [
  "Summarize this article for me.",
  "Write a professional email draft.",
  "Explain quantum computing in simple terms.",
  "Generate a workout plan for 4 days a week.",
  "Give me 5 startup ideas in the health sector.",
  "Help me debug this piece of code.",
  "Translate this text into Spanish.",
  "What’s happening in global tech news today?",
  "Suggest a recipe with only rice and eggs.",
  "Outline a blog post about remote work.",
  "Create a study schedule for my exams.",
  "Explain blockchain like I’m 12 years old.",
  "Write a LinkedIn bio for a software engineer.",
  "Summarize the key points from this PDF.",
  "Brainstorm marketing ideas for a new app.",
  "Turn this list into a professional table.",
  "Suggest travel destinations in India under ₹10k.",
  "Generate SQL queries from my schema.",
  "What are some AI tools for productivity?",
  "Explain the latest trend in web development.",
];

export const ChatInput = () => {
  const pathname = usePathname();
  const [input, setInput] = useState("");

  const { pendingFiles } = useChatStore();

  const { sendMessage, status } = useChat();

  return (
    <div
      className={cn(
        "absolute left-0 w-full flex bg-gradient-to-b pt-10 via-background/50 from-transparent to-background pb-2 flex-col items-center transition-all duration-300 px-2",
        pathname === "/" ? "bottom-40 bg-transparent" : "bottom-0"
      )}
    >
      {pathname === "/" && pendingFiles.length === 0 && (
        <ScrollArea className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 mb-7">
          <Suggestions className="flex gap-2 overflow-x-auto px-2">
            {suggestionsList.map((s, i) => (
              <Suggestion
                key={i}
                suggestion={s}
                onClick={() => setInput(s)}
                className="whitespace-nowrap"
              />
            ))}
          </Suggestions>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      )}

      <div className="w-full flex justify-center items-center">
        <PromptInputWithActions
          sendMessage={sendMessage}
          status={status}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  );
};
