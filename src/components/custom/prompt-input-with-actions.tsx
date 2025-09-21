"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";

import { Button } from "@/components/ui/button";
import { ArrowUp, Square, X, Check } from "lucide-react";
import { useRef, useState } from "react";
import { AiModelsComboBox } from "./ai-models-combo-box";
import { models } from "@/constants";
import { useHydratedModel } from "@/hooks/ai-model-store";
import { Skeleton } from "../ui/skeleton";
import { useChatStore } from "@/hooks/chat-store";
import { useChatIdStore } from "@/hooks/chat-id-store";
import { usePathname, useRouter } from "next/navigation";
import { createChat } from "@/actions/chat";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  input: string;
  setInput: (val: string) => void;
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
}

export interface UploadingFile {
  file: File;
  progress: number;
  url?: string;
}

export function PromptInputWithActions({
  input,
  setInput,
  status,
  sendMessage,
}: Props) {
  const pathname = usePathname();
  const { setPendingMessage } = useChatStore();
  const { chatId } = useChatIdStore();
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isUploading, setIsUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { setModel: setAiModel, model, hydrated } = useHydratedModel();

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const {
    setUploadingFiles: setUploadingFilesStore,
    uploadingFiles: uploadingFilesStore,
  } = useChatStore();

  console.log(uploadingFilesStore);

  // ✅ UploadThing v6 usage
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      setIsUploading(true);
    },
    uploadProgressGranularity: "fine",
    onUploadProgress: (p) => {
      // UploadThing sends global progress (all files together)
      setUploadProgress(p);
      if (pathname === "/") {
        setUploadingFilesStore((prev) =>
          prev.map((f) => ({ ...f, progress: p }))
        );
      } else {
        setUploadingFiles((prev) => prev.map((f) => ({ ...f, progress: p })));
      }
    },
    onClientUploadComplete: (data) => {
      setIsUploading(false);
      if (pathname === "/") {
        setUploadingFilesStore((prev) =>
          prev.map((f, i) =>
            i === prev.length - 1
              ? { ...f, url: data[0].ufsUrl, progress: 100 }
              : f
          )
        );
      } else {
        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === prev.length - 1
              ? { ...f, url: data[0].ufsUrl, progress: 100 }
              : f
          )
        );
      }
    },
  });

  const handleSubmit = async () => {
    if (input.trim() || uploadingFiles.length > 0) {
      if (pathname === "/") {
        if (isUploading) {
          return;
        } else {
          await createChat().then((data) => {
            setPendingMessage(input);
            queryClient.invalidateQueries(trpc.chats.getChats.queryOptions());
            router.push(`/chats/${data.id}`);
            setInput("");
          });
        }
      } else {
        if (isUploading) {
          return;
        }
        sendMessage(
          {
            role: "user",
            parts: [
              { type: "text", text: input },
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
          { body: { model: model.id, chatId } }
        );
        setInput("");
        setUploadingFiles([]);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);

    const newUploads: UploadingFile[] = files.map((file) => ({
      file,
      progress: 0,
    }));

    if (pathname === "/") {
      setUploadingFilesStore((prev) => [...prev, ...newUploads]);
    } else {
      setUploadingFiles((prev) => [...prev, ...newUploads]);
    }

    // ✅ Upload files
    startUpload(files);

    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  const filesToRender = pathname === "/" ? uploadingFilesStore : uploadingFiles;

  const handleRemoveFile = (file: File) => {
    if (pathname === "/") {
      setUploadingFilesStore((prev) => prev.filter((f) => f.file !== file));
    } else {
      setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
    }
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  // ✅ Check if any file is still uploading

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="lg:w-[70%] w-[99%] sm:w-[90%]"
    >
      {uploadingFiles.length ||
        (uploadingFilesStore.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 w-full">
            {filesToRender.map((f, index) => (
              <div
                key={index}
                className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm w-[220px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Loader or Tick */}
                {uploadProgress < 100 ? (
                  <span className="text-xs text-muted-foreground">
                    {uploadProgress}%
                  </span>
                ) : (
                  <Check className="size-4 text-green-500" />
                )}

                <div className="flex-1">
                  <span className="block max-w-[120px] truncate text-sm font-medium">
                    {f.file.name}
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveFile(f.file)}
                  className="hover:bg-secondary/50 rounded-full p-1"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ))}

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
                ref={uploadInputRef}
              />
              <span className="text-primary text-lg">+</span>
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
            disabled={isUploading} // ✅ Disable while uploading
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
