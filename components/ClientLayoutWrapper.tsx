"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "./main-nav";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <MainNav />}
      <main className="flex-1 px-10 py-5">{children}</main>
    </div>
  );
}
