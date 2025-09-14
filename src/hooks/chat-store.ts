import { create } from "zustand";

interface ChatStore {
  pendingMessage: string | null;
  pendingFiles: File[];
  fileUrl: string | null;
  setFileUrl: (url: string | null) => void;
  setPendingMessage: (msg: string | null) => void;
  setPendingFiles: (files: File[] | ((prev: File[]) => File[])) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  fileUrl: null,
  pendingMessage: null,
  pendingFiles: [],
  setPendingMessage: (msg) => set({ pendingMessage: msg }),
  setPendingFiles: (files) =>
    set((state) => ({
      pendingFiles:
        typeof files === "function" ? files(state.pendingFiles) : files,
    })),
  setFileUrl: (url) => set({ fileUrl: url }),
}));
