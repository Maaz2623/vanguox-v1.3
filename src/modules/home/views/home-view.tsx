"use client";

import { Blur } from "@/components/animate-ui/primitives/effects/blur";

import { usePathname } from "next/navigation";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { useState } from "react";
import { useChatStore } from "@/hooks/chat-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";
import { TopBar } from "@/components/custom/top-bar";
import { useChat } from "@ai-sdk/react";

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
  const [input, setInput] = useState("");

  const { sendMessage, status } = useChat();

  return (
    <div className="h-screen w-full relative flex justify-center flex-col items-center gap-y-8">
      <TopBar />

      <Blur className="">
        <h1 className="text-2xl lg:text-4xl font-bold text-center">
          What&apos;s lined up for you today?
        </h1>
      </Blur>

      <div className="bg-transparent w-full flex justify-center items-center z-50">
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
