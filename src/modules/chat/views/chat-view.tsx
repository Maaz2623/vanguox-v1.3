import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";

export const ChatView = () => {
  return (
    <div>
      <MainChat />
    </div>
  );
};

const MainChat = () => {
  return (
    <div className="bg-gray-100 relative h-screen w-1/2 mx-auto">
      <div className="bottom-1.5 absolute left-0 w-full">
        <PromptInputWithActions />
      </div>
    </div>
  );
};
