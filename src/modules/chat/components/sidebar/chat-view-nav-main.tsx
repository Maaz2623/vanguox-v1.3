"use client";

import { IconCirclePlusFilled } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronRightIcon,
  FilesIcon,
  HistoryIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export function ChatViewNavMain({ userId }: { userId: string }) {
  const router = useRouter();

  const pathname = usePathname();

  const trpc = useTRPC();

  const { data: chats } = useQuery(trpc.chats.getChats.queryOptions());

  const { open } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "w-full text-start! flex bg-foreground text-background hover:bg-foreground hover:text-background items-center"
              )}
              variant={`outline`}
              onClick={() => router.push(`/`)}
            >
              <IconCirclePlusFilled />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full text-start! flex justify-start items-center"
              onClick={() => router.push(`/files`)}
            >
              <FilesIcon />
              Files
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full text-start! flex justify-between items-center">
                  <HistoryIcon />
                  History
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />{" "}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="">
                <ScrollArea className="h-[170px]">
                  <SidebarMenuSub>
                    {chats?.map((item) => {
                      const isActive = pathname === `/chats/${item.id}`;
                      return (
                        <SidebarMenuSubItem key={Math.random()}>
                          <SidebarMenuSubButton
                            className={cn(
                              "",
                              isActive && "bg-neutral-500/10 font-semibold"
                            )}
                            onClick={() => {
                              if (!isActive) {
                                stop();
                              }
                            }}
                            asChild
                          >
                            <Link href={`/chats/${item.id}`}>
                              <span className="w-[150px] truncate">
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </ScrollArea>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
