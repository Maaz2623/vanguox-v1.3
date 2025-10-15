import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: "vanguox-702bb.firebaseapp.com",
  projectId: "vanguox-702bb",
  storageBucket: "vanguox-702bb.firebasestorage.app",
  messagingSenderId: "416425412193",
  appId: "1:416425412193:web:580636abe0b457c3a7cc20",
  measurementId: "G-RZ58VKHV31",
};

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
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

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
            <Toaster />
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
