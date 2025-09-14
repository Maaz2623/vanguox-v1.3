"use client";
import { useSidebarStore } from "@/hooks/sidebar-store";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Sidebar = () => {
  const { open } = useSidebarStore();

  return (
    <div
      className={cn(
        "border w-[20vw] h-[90vh] z-100 bottom-0 absolute",
        open ? "flex" : "hidden"
      )}
    ></div>
  );
};
