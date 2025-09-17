import { UploadingFile } from "@/components/custom/prompt-input-with-actions";
import { create } from "zustand";

interface ChatStore {
  pendingMessage: string | null;
  setPendingMessage: (msg: string | null) => void;
  uploadingFiles: UploadingFile[];
  setUploadingFiles: (
    files: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])
  ) => void;
  clearUploadingFiles: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  pendingMessage: null,
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
  uploadingFiles: [],
  setUploadingFiles: (files) =>
    set((state) => ({
      uploadingFiles:
        typeof files === "function" ? files(state.uploadingFiles) : files,
    })),
  clearUploadingFiles: () => set({ uploadingFiles: [] }),
}));
