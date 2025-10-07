"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { CrownIcon, GaugeIcon } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PlansDialog } from "../plans-dialog";
import { useQuery } from "@tanstack/react-query";

export function ChatViewNavSecondary({
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  const router = useRouter();

  const { open } = useSidebar();

  const trpc = useTRPC();

  const { data: currentSubscription, isLoading } = useQuery(
    trpc.subscription.getCurrentSubscription.queryOptions()
  );

  const { data: usage } = useQuery(trpc.usage.getMonthUsage.queryOptions());

  const totalTokens = usage?.reduce((sum, u) => sum + u.tokensUsed, 0) ?? 0;

  const maxTokens = currentSubscription?.maxTokens || 15000;

  const [plansDialogOpen, setPlansDialogOpen] = React.useState(false);

  const dateToShow = currentSubscription?.billingCycleEnd
    ? new Date(currentSubscription.billingCycleEnd)
    : null; // Adding 30 days

  const formattedDate =
    dateToShow &&
    dateToShow.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading) {
    return;
  }

  const progressValue = (totalTokens / maxTokens) * 100;

  const usageExceeded = totalTokens >= maxTokens;

  return (
    <>
      <PlansDialog open={plansDialogOpen} setOpen={setPlansDialogOpen} />
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="mb-2">
              {!open ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      onClick={() => router.push(`/settings`)}
                      className={cn(
                        "",
                        pathname === "/settings" &&
                          "dark:bg-neutral-800 bg-neutral-200 font-semibold"
                      )}
                    >
                      <span className="">
                        <GaugeIcon />
                        Usage
                      </span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-background! text-foreground"
                  >
                    <div className="w-full rounded-2xl border bg-card shadow-sm p-4 flex flex-col gap-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight capitalize">
                          {currentSubscription
                            ? currentSubscription.subscriptionType
                            : "Free"}
                        </h2>
                        {!currentSubscription && (
                          <Button
                            size="sm"
                            className="rounded-full"
                            variant="outline"
                            onClick={() => setPlansDialogOpen(true)}
                          >
                            <CrownIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Usage Info */}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(totalTokens)} /{" "}
                          {formatNumber(
                            currentSubscription
                              ? currentSubscription.maxTokens
                              : 15000
                          )}{" "}
                          tokens used
                        </p>
                        <Progress
                          value={progressValue}
                          className="h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="w-full rounded-2xl border bg-card shadow-sm p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight capitalize">
                      {currentSubscription
                        ? currentSubscription.subscriptionType
                        : "Free"}
                    </h2>
                    {!currentSubscription && (
                      <Button
                        size="sm"
                        className="rounded-full relative"
                        variant="outline"
                        onClick={() => setPlansDialogOpen(true)}
                      >
                        {usageExceeded && (
                          <span className="h-2 w-2 shrink-0 animate-pulse absolute top-0 right-0 bg-blue-500 rounded-full"></span>
                        )}
                        <CrownIcon className="h-4 w-4" />
                        Upgrade
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(totalTokens)} /{" "}
                      {formatNumber(
                        currentSubscription
                          ? currentSubscription.maxTokens
                          : 15000
                      )}{" "}
                      tokens used
                    </p>
                    <Progress
                      value={progressValue}
                      className="h-2 rounded-full"
                    />
                  </div>

                  {/* Ends At (only for Pro) */}
                  {formattedDate && (
                    <p className="text-xs text-muted-foreground">
                      Ends at {formattedDate}
                    </p>
                  )}
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
