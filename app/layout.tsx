import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MainNav } from "@/components/main-nav";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanceTrack - Manage Your Finances",
  description:
    "A comprehensive financial management system to track your accounts, budgets, and transactions.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen flex-col overflow-hidden">
            <MainNav />
            <main className="flex-1 overflow-auto px-10 py-5">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
