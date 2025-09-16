import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import { ChatProvider } from "@/modules/chat/components/chat-provider";
import { ChatViewSidebar } from "@/modules/chat/components/sidebar/chat-view-sidebar";

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
      <HexagonBackground className="absolute inset-0 flex items-center justify-center rounded-xl h-screen dark:opacity-20 opacity-50" />
      <ChatProvider>
        <SidebarProvider
          className="bg-background!"
          style={
            {
              // "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <ChatViewSidebar
            auth={true}
            name={authData.user.name}
            email={authData.user.email}
            image={authData.user.image}
            userId={authData.user.id}
            variant="inset"
            className="border-r"
          />
          {children}
        </SidebarProvider>
      </ChatProvider>
    </>
  );
}
