"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // da izbjegnemo hydration mismatch

  useEffect(() => {
    setIsClient(true); // potvrdi da smo u browseru

    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    console.log("🔐 Checking auth:");
    console.log("Access Token:", accessToken);
    console.log("User:", user);

    if ((!user || !accessToken) && false) {
      router.push("/login");
    }
  }, [router]);

  if (!isClient) return null; // izbjegni prerani render

  return <>{children}</>;
}
