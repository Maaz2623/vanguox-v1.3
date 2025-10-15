import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
export const metadata: Metadata = {
  title: "Vanguox - All-in-One AI Platform for all your tasks",
  description: "All your AI models at one place.",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
    },
  ],
  keywords: [
    "Vanguox",
    "AI for daily tasks vanguox",
    "productivity automation vanguox",
    "task automation vanguox",
    "AI tools vanguox",
    "personal assistant AI vanguox",
    "business productivity vanguox",
    "workflow optimization vanguox",
    "daily work AI solutions vanguox",
    "AI for efficiency vanguox",
    "time-saving AI vanguox",
    "AI for teams vanguox",
    "smart task management vanguox",
  ],
};

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cairo.className} antialiased`}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <FirebaseAnalytics /> {/* ✅ Client-side only */}
            <Toaster />
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
