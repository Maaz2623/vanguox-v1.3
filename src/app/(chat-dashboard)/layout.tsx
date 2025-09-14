import { ChatProvider } from "@/modules/chat/components/chat-provider";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";

export default async function ChatDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HexagonBackground className="absolute inset-0 flex items-center justify-center rounded-xl h-screen dark:opacity-20 opacity-30" />
      <ChatProvider>{children}</ChatProvider>
    </>
  );
}
