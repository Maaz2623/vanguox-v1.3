import { Action } from "@/components/ai-elements/actions";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import { ChatInput } from "@/components/custom/chat-input";
import { PromptInputWithActions } from "@/components/custom/prompt-input-with-actions";
import { useModelStore } from "@/hooks/ai-model-store";
import { useChatIdStore } from "@/hooks/chat-id-store";
import { useChatStore } from "@/hooks/chat-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, sanitizeText } from "@/lib/utils";
import { useSharedChatContext } from "@/modules/chat/components/chat-provider";
import { useTRPC } from "@/trpc/client";
import { useChat } from "@ai-sdk/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { UIMessage } from "ai";
import { CheckIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

interface Props {
  chatId: string;
}

export const MessagesList = ({ chatId }: Props) => {
  const trpc = useTRPC();

  const { data: rawMessages } = useQuery(
    trpc.chats.getChatMessages.queryOptions({ chatId })
  );

  const previousMessages: UIMessage[] =
    rawMessages?.map((m) => m.message) ?? [];

  const { chatId: storeChatId, setChatId } = useChatIdStore();

  const [input, setInput] = useState("");

  const {
    pendingMessage,
    setPendingMessage,
    pendingFiles,
    setPendingFiles,
    fileUrl,
    setFileUrl,
  } = useChatStore();

  const { messages, sendMessage, regenerate, status } = useChat({
    messages: previousMessages,
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
        // const fileParts =
        //   pendingFile && fileUrl
        //     ? [await convertFileToDataURL(pendingFile, fileUrl)]
        //     : [];
        sendMessage(
          {
            role: "user",
            parts: [{ type: "text", text: pendingMessage }],
          },
          { body: { model: model.id, chatId: chatId } }
        );

        setPendingMessage(null);
        setPendingFiles([]);
        setFileUrl(null);
      };

      send();
    }
  }, [
    pendingMessage,
    pendingFiles,
    sendMessage,
    setPendingMessage,
    setPendingFiles,
    model.id,
    chatId,
  ]);

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

  console.log(previousMessages);

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
              className={cn("w-[70%] mx-auto", isMobile && "w-full")}
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
                                        "text-[16px] leading-relaxed max-w-[40vw]! overflow-x-auto!",
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
                                        <Action
                                          onClick={safeRegenerate}
                                          label="Retry"
                                        >
                                          <RefreshCcwIcon className="size-3.5" />
                                        </Action>
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
                {status === "submitted" && <Loader className="ml-5 mt-5" />}
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
