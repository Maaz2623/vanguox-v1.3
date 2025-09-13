import { ChatProvider } from "@/modules/chat/components/chat-provider";

export default async function ChatDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
