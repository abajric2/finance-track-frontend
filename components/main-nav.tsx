"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DollarSign, PiggyBank, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
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
              pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={cn(
              "text-sm font-medium",
              pathname === "/transactions" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Transactions
          </Link>
          <Link
            href="/recurring"
            className={cn(
              "text-sm font-medium",
              pathname === "/recurring" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Recurring
          </Link>
          <Link
            href="/accounts"
            className={cn(
              "text-sm font-medium",
              pathname.startsWith("/accounts") ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Accounts
          </Link>
          <Link
            href="/budgets"
            className={cn(
              "text-sm font-medium",
              pathname === "/budgets" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Budgets
          </Link>
          <Link
            href="/goals"
            className={cn(
              "text-sm font-medium",
              pathname === "/goals" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Goals
          </Link>
          <Link
            href="/reports"
            className={cn(
              "text-sm font-medium",
              pathname === "/reports" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Reports
          </Link>
          <Link
            href="/settings"
            className={cn(
              "text-sm font-medium",
              pathname === "/settings" ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <PiggyBank className="mr-2 h-4 w-4" />
            Add Account
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4 sm:inline-block hidden" />
            <span className="sm:inline-block hidden">New Transaction</span>
            <Plus className="sm:hidden h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

