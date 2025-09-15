"use client";
import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";
import { SidebarTrigger } from "../ui/sidebar";

export const TopBar = () => {
  return (
    <div className="h-16 top-0 bg-gradient-to-b via-background/70 from-background to-transparent absolute md:px-3 px-2 left-0 w-full z-50 flex justify-between items-center">
      <SidebarTrigger />
      <AnimatedThemeToggler />
    </div>
  );
};
