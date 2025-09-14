"use client";
import { SidebarIcon } from "lucide-react";
import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/hooks/sidebar-store";

export const TopBar = () => {
  const { setOpen, open } = useSidebarStore();

  return (
    <div className="h-12 top-0 bg-gradient-to-b via-background/70 from-background to-transparent absolute md:px-3 px-0 left-0 w-full z-100 flex justify-between items-center">
      <Button variant={`ghost`} size={`icon`} onClick={() => setOpen(!open)}>
        <SidebarIcon />
      </Button>
      <AnimatedThemeToggler />
    </div>
  );
};
