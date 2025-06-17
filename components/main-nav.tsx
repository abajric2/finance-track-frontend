"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DollarSign, LogOut, PiggyBank, Plus, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import {
  getCurrentUser,
  logoutUser,
  upgradeUserToPremium,
} from "@/lib/userApi";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserResponse } from "@/types/user";
import { toast } from "react-toastify";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isUserReady, setIsUserReady] = useState(false);

  useEffect(() => {
    const storedUser = getCurrentUser();
    console.log("Useraa ", storedUser);
    setUser(storedUser);
    setIsUserReady(true);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };
  const handleUpgrade = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await upgradeUserToPremium(user.userId);

      const updatedUser = {
        ...user,
        role: "PAID",
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setShowModal(false);
      toast.success(
        "Your account has been successfully upgraded. The page will refresh now..."
      );

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Upgrade failed", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background px-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <MobileNav />
          <DollarSign className="h-6 w-6" />
          <h1 className="text-xl font-bold">FinanceTrack</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium",
              pathname === "/"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={cn(
              "text-sm font-medium",
              pathname === "/transactions"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Transactions
          </Link>
          <Link
            href="/recurring"
            className={cn(
              "text-sm font-medium",
              pathname === "/recurring"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Recurring
          </Link>
          {/*<Link
            href="/accounts"
            className={cn(
              "text-sm font-medium",
              pathname.startsWith("/accounts")
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Accounts
          </Link>*/}
          <Link
            href="/budgets"
            className={cn(
              "text-sm font-medium",
              pathname === "/budgets"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Budgets
          </Link>
          <Link
            href="/goals"
            className={cn(
              "text-sm font-medium",
              pathname === "/goals"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Goals
          </Link>
          <Link
            href="/reports"
            className={cn(
              "text-sm font-medium",
              pathname === "/reports"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Reports
          </Link>
          <Link
            href="/settings"
            className={cn(
              "text-sm font-medium",
              pathname === "/settings"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isUserReady && user?.role !== "PAID" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-amber-600 border-amber-600 hover:bg-[#d977064c]"
            >
              <Sparkles className="w-4 h-4" />
              Go Premium
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-foreground" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action will upgrade your account to Premium. The page will
            refresh after the upgrade.
          </p>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={handleUpgrade}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              {loading ? "Upgrading..." : "Confirm Upgrade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
