import { Action } from "@/components/ai-elements/actions";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";
import { Loader } from "@/components/ui/loader";
import { useModelStore } from "@/hooks/ai-model-store";
import { useChatIdStore } from "@/hooks/chat-id-store";
import { useChatStore } from "@/hooks/chat-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, sanitizeText } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls, UIMessage } from "ai";
import { CheckIcon, CopyIcon, FileIcon, RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  chatId: string;
  previousMessages: UIMessage[];
}

export const MessagesList = ({ chatId, previousMessages }: Props) => {
  const trpc = useTRPC();

  const { chatId: storeChatId, setChatId } = useChatIdStore();

  const [input, setInput] = useState("");

  const {
    pendingMessage,
    setPendingMessage,
    uploadingFiles,
    setUploadingFiles,
  } = useChatStore();

  const { messages, sendMessage, regenerate, status, error } = useChat({
    messages: previousMessages,
    onError: (error) => {
      if (error.message.startsWith("Token limit")) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const sentRef = useRef(false);

  const { model } = useModelStore();

  useEffect(() => {
    if (!storeChatId) {
      setChatId(chatId);
    }

    if (pendingMessage && !sentRef.current) {
      sentRef.current = true;

      const send = async () => {
        sendMessage(
          {
            role: "user",
            parts: [
              { type: "text", text: pendingMessage },
              ...uploadingFiles
                .filter((f) => f.url)
                .map((f) => ({
                  filename: f.file.name,
                  type: "file" as const,
                  url: f.url!,
                  mediaType: f.file.type,
                })),
            ],
          },
          { body: { model: model.id, chatId: chatId } }
        );

        setPendingMessage(null);
        setUploadingFiles([]);
      };

      send();
    }
  }, [pendingMessage, sendMessage, setPendingMessage, model.id, chatId]);

  const pathname = usePathname();

  const isMobile = useIsMobile();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const safeRegenerate = () => {
    // Only regenerate if the last assistant message has valid content
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");

    if (
      !lastAssistant ||
      !lastAssistant.parts?.some((p) => p.type === "text" && p.text.trim())
    ) {
      console.warn(
        "Cannot regenerate: last assistant message has no text content."
      );
      return;
    }

    regenerate();
  };

  return (
    <div className="mx-auto relative size-full h-screen w-full overflow-hidden">
      {/* {!isMobile && (
        <SidebarTrigger className="absolute top-5 left-5 z-[1000] size-8" />
      )} */}
      {/* {isMobile && <ChatViewSiteHeader chatId={chatId} />} */}
      <Suspense fallback={<div>loading...</div>}>
        <div className="flex flex-col h-screen overflow-hidden">
          <Conversation className="max-h-screen  overflow-hidden  w-full">
            <ConversationContent
              className={cn("w-[70%] pt-10 mx-auto", isMobile && "w-full")}
            >
              <div className="h-full pb-[40vh] z-50">
                {messages.map((message) => (
                  <div key={message.id}>
                    <Message from={message.role} key={message.id}>
                      <MessageContent
                        className={cn(
                          "bg-transparent!",
                          message.role === "assistant" && "bg-transparent!"
                        )}
                      >
                        {(message.role === "user"
                          ? [...message.parts].reverse()
                          : message.parts
                        ).map((part, i) => {
                          switch (part.type) {
                            case "file":
                              return (
                                <div
                                  key={i}
                                  className="relative border rounded-lg w-[200px] h-[250px] overflow-hidden flex items-center justify-center"
                                >
                                  {part.mediaType.startsWith("image/") ? (
                                    <Image
                                      src={part.url}
                                      alt="uploaded file"
                                      fill
                                      className="object-contain"
                                    />
                                  ) : (
                                    <FileIcon className="size-10 text-gray-500" />
                                  )}
                                </div>
                              );

                            case "reasoning":
                              return (
                                <Reasoning
                                  key={`${message.id}-${i}`}
                                  className="w-full"
                                  isStreaming={status === "streaming"}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );
                            case "text":
                              const modelIcon = model.icon;
                              const modelName = model.name;
                              return (
                                <div
                                  key={`${message.id}-${i}`}
                                  className={cn(
                                    "flex items-start gap-3",
                                    message.role === "user" &&
                                      " justify-end px-2"
                                  )}
                                >
                                  {message.role === "assistant" && (
                                    <Image
                                      src={modelIcon}
                                      width={25}
                                      height={25}
                                      alt="model-logo"
                                      className="rounded-full shrink-0"
                                    />
                                  )}
                                  {/* Right: Text + Actions */}
                                  <div className="flex flex-col mt-0 gap-y-2">
                                    {message.role === "assistant" && (
                                      <span className="text-base text-muted-foreground font-semibold">
                                        {modelName}
                                      </span>
                                    )}
                                    <Response
                                      className={cn(
                                        "text-[16px] leading-relaxed md:max-w-[40vw]! overflow-x-auto!",
                                        message.role === "user" &&
                                          "dark:bg-primary/10! dark:text-white bg-primary px-3 py-2 text-[16px] !rounded-tl-2xl !rounded-tr-2xl !rounded-bl-2xl !rounded-br-none",
                                        isMobile && "text-[14px] max-w-[60vw]!"
                                        // open && !isMobile && "max-w-[35vw]!"
                                      )}
                                    >
                                      {sanitizeText(part.text)}
                                    </Response>
                                    {message.role === "assistant" && (
                                      <div className="flex gap-2 mt-2 mb-4">
                                        {/* <Action
                                          onClick={safeRegenerate}
                                          label="Retry"
                                        >
                                          <RefreshCcwIcon className="size-3.5" />
                                        </Action> */}
                                        <Action
                                          onClick={() =>
                                            handleCopy(
                                              `${message.id}-${i}`,
                                              part.text
                                            )
                                          }
                                          label="Copy"
                                        >
                                          {copiedId === `${message.id}-${i}` ? (
                                            <CheckIcon className="size-3.5" />
                                          ) : (
                                            <CopyIcon className="size-3.5" />
                                          )}{" "}
                                        </Action>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            case "tool-appBuilder":
                              switch (part.state) {
                                case "input-available":
                                  return <div key={i}>Building your app..</div>;
                                case "output-available":
                                  return <div key={i}>Built</div>;
                              }
                            case "tool-webSearcher":
                              switch (part.state) {
                                case "input-available":
                                  return (
                                    <div key={i} className="animate-pulse">
                                      Searching the web
                                    </div>
                                  );
                              }
                            case "tool-imageGenerator":
                              switch (part.state) {
                                case "input-available":
                                  return (
                                    <div key={i} className="animate-pulse">
                                      Generating your image (using gemini)
                                    </div>
                                  );
                              }
                            case "tool-addResource":
                              switch (part.state) {
                                case "input-available":
                                  return <div key={i}>Saving Data</div>;
                              }
                          }
                        })}
                      </MessageContent>
                    </Message>
                  </div>
                ))}
                {status === "submitted" && (
                  <Loader variant={`typing`} className="ml-5 mt-5" />
                )}
              </div>
            </ConversationContent>
            <ConversationScrollButton className="z-100 mb-26 bg-background!" />
          </Conversation>
        </div>
      </Suspense>
      <div
        className={cn(
          "absolute left-0 w-full flex bg-gradient-to-b pt-10 via-background/50 from-transparent to-background pb-2 flex-col items-center transition-all duration-300 px-2",
          pathname === "/" ? "bottom-40 bg-transparent" : "bottom-0"
        )}
      >
        <div className="w-full flex justify-center items-center">
          <PromptInputWithActions
            sendMessage={sendMessage}
            status={status}
            input={input}
            setInput={setInput}
          />
        </div>
      </div>
    </div>
  );
};
