"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "./main-nav";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={true}
        theme="light"
        style={{ zIndex: 999999 }}
      />
    </div>
  );
}
