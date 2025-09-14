import { Blur } from "@/components/animate-ui/primitives/effects/blur";
import { ChatInput } from "@/components/custom/chat-input";
import React from "react";

const HomePage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Blur className="">
        <h1 className="text-2xl lg:text-4xl -mt-24 lg:-mt-20 font-bold text-center">
          What&apos;s lined up for you today?
        </h1>
      </Blur>
      <ChatInput />
    </div>
  );
};

export default HomePage;
