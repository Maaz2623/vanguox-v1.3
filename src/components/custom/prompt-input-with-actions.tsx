"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { useRef, useState } from "react";
import { AiModelsComboBox } from "./ai-models-combo-box";
import { models } from "@/constants";
import { useHydratedModel, useModelStore } from "@/hooks/ai-model-store";
import { Skeleton } from "../ui/skeleton";
import { useSharedChatContext } from "@/modules/chat/components/chat-provider";
import { useChatStore } from "@/hooks/chat-store";
import { useChatIdStore } from "@/hooks/chat-id-store";
import { usePathname, useRouter } from "next/navigation";
import { createChat } from "@/actions/chat";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface Props {
  input: string;
  setInput: (val: string) => void;
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
}

export function PromptInputWithActions({
  input,
  setInput,
  status,
  sendMessage,
}: Props) {
  const pathname = usePathname();
  const { setPendingMessage } = useChatStore();
  const { chatId, setChatId } = useChatIdStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { pendingFiles, setPendingFiles } = useChatStore();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const trpc = useTRPC();

  const { setModel: setAiModel, model, hydrated } = useHydratedModel();

  const handleSubmit = async () => {
    if (input.trim() || pendingFiles.length > 0) {
      if (pathname === "/") {
        await createChat().then((data) => {
          setPendingMessage(input);
          queryClient.invalidateQueries(trpc.chats.getChats.queryOptions());
          router.push(`/chats/${data.id}`);
          setInput("");
        });
      } else {
        sendMessage(
          {
            role: "user",
            parts: [{ type: "text", text: input }],
          },
          { body: { model: model.id, chatId: chatId } }
        );
        setInput("");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setPendingFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="lg:w-[70%] w-[99%] sm:w-[90%]"
    >
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {pendingFiles.map((file, index) => (
            <div
              key={index}
              className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Paperclip className="size-4" />
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="hover:bg-secondary/50 rounded-full p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <PromptInputTextarea
        autoFocus
        placeholder="Ask me anything..."
        className="bg-transparent!"
      />

      <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
        <div className="flex gap-x-1">
          <PromptInputAction tooltip="Attach files">
            <label
              htmlFor="file-upload"
              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Paperclip className="text-primary size-5" />
            </label>
          </PromptInputAction>
          <PromptInputAction tooltip="Select AI Model">
            {hydrated ? (
              <AiModelsComboBox
                models={models}
                value={model.id}
                onChange={(selectedModel) => setAiModel(selectedModel)}
              />
            ) : (
              <Skeleton className="w-[150px] h-8 bg-foreground/10" />
            )}
          </PromptInputAction>
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
          >
            {status === "streaming" || status === "submitted" ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
}
