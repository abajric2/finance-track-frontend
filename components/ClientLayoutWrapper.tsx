"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "./main-nav";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = pathname === "/login";

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {!hideNav && <MainNav />}
      <main className="flex-1 overflow-auto px-10 py-5">{children}</main>
    </div>
  );
}
