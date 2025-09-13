"use client";

import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, Loader2, Loader2Icon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useState } from "react";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";

export const AuthForm = () => {
  const { resolvedTheme } = useTheme();

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    authClient.signIn.social(
      { provider: "google" },
      { onRequest: () => setLoading(true) }
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <StarsBackground
        starColor={resolvedTheme === "dark" ? "#FFF" : "#000"}
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-xl",
          "dark:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)] bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]"
        )}
      />
      <fieldset disabled={loading} className="w-full max-w-md">
        <div className="w-full rounded-2xl backdrop-blur-md border border-border/50 bg-background/70  shadow-xl p-8 space-y-6 text-center">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with your Google account
            </p>
          </div>

          <AnimatedSubscribeButton
            disabled={loading}
            className="w-full disabled:bg-muted-foreground"
            onClick={handleGoogleLogin}
          >
            <span className="group inline-flex items-center gap-x-2">
              <FaGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </span>
            <span className="group inline-flex items-center gap-x-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Signing In
            </span>
          </AnimatedSubscribeButton>
          {/* Google Sign-In */}
        </div>
      </fieldset>
    </div>
  );
};
