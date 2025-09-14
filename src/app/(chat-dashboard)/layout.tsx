import { ChatProvider } from "@/modules/chat/components/chat-provider";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { TopBar } from "@/components/custom/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatViewSidebar } from "@/modules/chat/components/sidebar/chat-view-sidebar";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/custom/sidebar";

export default async function ChatDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    redirect(`/auth`);
  }

  return (
    <>
      <HexagonBackground className="absolute inset-0 flex items-center justify-center rounded-xl h-screen dark:opacity-20 opacity-30" />
      <ChatProvider>
        <Sidebar />
        <TopBar />
        {children}
      </ChatProvider>
    </>
  );
}
