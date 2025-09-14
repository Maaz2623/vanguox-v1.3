import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";

export const TopBar = () => {
  return (
    <div className="h-12 top-0 bg-gradient-to-b via-background/70 from-background to-transparent absolute md:px-3 px-0 left-0 w-full z-100 flex justify-between items-center">
      <div />
      <AnimatedThemeToggler />
    </div>
  );
};
