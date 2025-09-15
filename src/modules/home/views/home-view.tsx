"use client";

import { Blur } from "@/components/animate-ui/primitives/effects/blur";

import { usePathname } from "next/navigation";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { useState } from "react";
import { useChatStore } from "@/hooks/chat-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";

export const HomeView = () => {
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
  const pathname = usePathname();
  const [input, setInput] = useState("");

  const { pendingFiles } = useChatStore();

  return (
    <div className="h-screen w-full flex justify-center flex-col items-center gap-y-8">
      <Blur className="">
        <h1 className="text-2xl lg:text-4xl font-bold text-center">
          What&apos;s lined up for you today?
        </h1>
      </Blur>
      <ScrollArea className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
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
      <div className="bg-transparent w-full flex justify-center items-center z-100">
        <PromptInputWithActions input={input} setInput={setInput} />
      </div>
    </div>
  );
};
