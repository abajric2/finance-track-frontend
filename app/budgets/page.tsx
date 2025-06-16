"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  PiggyBank,
  Plus,
  Search,
  Settings,
  Share2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { BudgetResponse } from "@/types/budget";
import { getCurrentUser, getUserByUuid } from "@/lib/userApi";
import {
  getAllCategories,
  getBudgetsByUserUuid,
  getUsersByBudgetId,
} from "@/lib/budgetApi";
import { CategoryDTO } from "@/types/budgetCategory";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ManageCategoriesModal from "@/components/ManageCategoriesModal";
import { ToastContainer } from "react-toastify";
import CreateBudgetModal from "@/components/CreateBudgetModal";
import { UserResponse } from "@/types/user";
import { SharedBudgetCard } from "@/components/SharedBudgetCard";

export default function BudgetsPage() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [filter, setFilter] = useState<"all" | "over" | "under">("all");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<
    Record<number, UserResponse[]>
  >({});

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => {
      map.set(cat.categoryId, cat.name);
    });
    return map;
  }, [categories]);

  const selectedCategoryName =
    selectedCategoryId !== null
      ? categoryMap.get(selectedCategoryId)
      : "All Categories";

  const handleShareBudget = (budgetId: number) => {
    setSelectedBudget(budgetId);
    setShowShareDialog(true);
  };

  useEffect(() => {
    const localUser = getCurrentUser();
    if (localUser) {
      setUser(localUser);

      Promise.all([
        getBudgetsByUserUuid(localUser.userUuid),
        getAllCategories(),
      ])
        .then(async ([budgetsRes, categoriesRes]) => {
          setBudgets(budgetsRes);
          setCategories(categoriesRes);

          const sharedBudgets = budgetsRes.filter((budget) => budget.shared);

          const usersMap: Record<number, UserResponse[]> = {};

          for (const b of sharedBudgets) {
            const users = await getUsersByBudgetId(b.budgetId);
            const fullUsers = await Promise.all(
              users
                .filter((u) => u.userUuid !== localUser.userUuid)
                .map((u) => getUserByUuid(u.userUuid))
            );
            usersMap[b.budgetId] = fullUsers;
          }

          setSharedUsers(usersMap);
        })
        .catch((err) => console.error("Failed to fetch data", err));
    }
  }, []);

  useEffect(() => {
    const localUser = getCurrentUser();
    if (!showShareDialog || !selectedBudget || !localUser) return;

    const loadSharedForSelectedBudget = async () => {
      try {
        const users = await getUsersByBudgetId(selectedBudget);
        const fullUsers = await Promise.all(
          users
            .filter((u) => u.userUuid !== localUser.userUuid)
            .map((u) => getUserByUuid(u.userUuid))
        );

        setSharedUsers((prev) => ({
          ...prev,
          [selectedBudget]: [...fullUsers, localUser],
        }));
      } catch (error) {
        console.error(
          "Failed to load shared users for selected budget:",
          error
        );
      }
    };

    loadSharedForSelectedBudget();
  }, [showShareDialog, selectedBudget]);

  const overBudget = budgets.filter((b) => b.currentAmount > b.amount);
  const underBudget = budgets.filter((b) => b.currentAmount <= b.amount);

  const filteredBudgets =
    filter === "all" ? budgets : filter === "over" ? overBudget : underBudget;

  const sharedByYou = budgets.filter(
    (budget) => budget.shared && budget.owner === user?.userUuid
  );

  const sharedWithYou = budgets.filter(
    (budget) => budget.shared && budget.owner !== user?.userUuid
  );

  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
            <p className="text-muted-foreground">
              Track your spending and stay within your budget.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateBudgetOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </div>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="categories">All Budgets</TabsTrigger>
            <TabsTrigger value="trends">Budget Trends</TabsTrigger>
            <TabsTrigger value="planning">Budget Planning</TabsTrigger>
            <TabsTrigger value="shared">Shared Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Filter: Over / Under / All */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="mr-2 h-4 w-4" />
                      Budget Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuCheckboxItem
                      checked={filter === "all"}
                      onCheckedChange={() => setFilter("all")}
                    >
                      Show All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filter === "over"}
                      onCheckedChange={() => setFilter("over")}
                    >
                      Over Budget
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filter === "under"}
                      onCheckedChange={() => setFilter("under")}
                    >
                      Under Budget
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-64 justify-between"
                    >
                      {selectedCategoryName}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command>
                      <CommandInput placeholder="Filter by category..." />
                      <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup heading="Categories">
                          <CommandItem
                            onSelect={() => {
                              setSelectedCategoryId(null);
                              setOpen(false);
                            }}
                          >
                            All Categories
                          </CommandItem>
                          {Array.from(categoryMap.entries()).map(
                            ([id, name]) => (
                              <CommandItem
                                key={id}
                                onSelect={() => {
                                  setSelectedCategoryId(id);
                                  setOpen(false);
                                }}
                                className={
                                  selectedCategoryId === id ? "bg-muted" : ""
                                }
                              >
                                {name}
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManageCategoriesOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </div>

            {/* Budgets list */}
            <div className="space-y-4">
              {filteredBudgets
                .filter((budget) =>
                  selectedCategoryId
                    ? budget.categoryId === selectedCategoryId
                    : true
                )
                .map((budget) => {
                  const isOver = budget.currentAmount > budget.amount;
                  const categoryName =
                    categoryMap.get(budget.categoryId) ?? "Unknown Category";

                  return (
                    <BudgetCategory
                      key={budget.budgetUuid}
                      category={categoryName}
                      spent={budget.currentAmount}
                      budget={budget.amount}
                      icon={<PiggyBank className="h-4 w-4" />}
                      overBudget={isOver}
                      onShare={
                        user?.role === "PAID" && budget.owner === user.userUuid
                          ? () => handleShareBudget(budget.budgetId)
                          : undefined
                      }
                      isShared={budget.shared}
                      period={budget.period}
                      sharedWith={
                        sharedUsers[budget.budgetId]
                          ?.filter((u) => u.userUuid !== user?.userUuid)
                          .map((u) => ({
                            name: u.name,
                            email: u.email,
                            avatar: "",
                          })) ?? []
                      }
                    />
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget Trends</CardTitle>
                <CardDescription>
                  Compare your spending over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ArrowUpDown className="mx-auto h-12 w-12 mb-4" />
                  <p>Budget trend visualization would appear here</p>
                  <p className="text-sm">
                    Showing monthly spending patterns and trends
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planning" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>
                  Plan your budget for upcoming months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <CustomLabel>Month</CustomLabel>
                      <Select defaultValue="july-2023">
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="july-2023">July 2023</SelectItem>
                          <SelectItem value="august-2023">
                            August 2023
                          </SelectItem>
                          <SelectItem value="september-2023">
                            September 2023
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <CustomLabel>Total Budget</CustomLabel>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          $
                        </span>
                        <Input
                          placeholder="5,000.00"
                          className="pl-7"
                          defaultValue="5,000.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CustomLabel>Budget Categories</CustomLabel>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <BudgetPlanningItem name="Housing" amount={1500} />
                      <BudgetPlanningItem name="Food & Dining" amount={800} />
                      <BudgetPlanningItem name="Transportation" amount={400} />
                      <BudgetPlanningItem name="Entertainment" amount={300} />
                      <BudgetPlanningItem name="Shopping" amount={500} />
                      <BudgetPlanningItem name="Utilities" amount={250} />
                      <BudgetPlanningItem
                        name="Health & Fitness"
                        amount={200}
                      />
                      <BudgetPlanningItem name="Personal Care" amount={150} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Save Budget Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="shared" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Shared Budgets</CardTitle>
                <CardDescription>
                  Manage budgets shared with you and by you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue={user?.role === "PAID" ? "by-you" : "with-you"}
                >
                  <TabsList>
                    {user?.role === "PAID" && (
                      <TabsTrigger value="by-you">Shared by You</TabsTrigger>
                    )}
                    <TabsTrigger value="with-you">Shared with You</TabsTrigger>
                  </TabsList>
                  {user?.role === "PAID" && (
                    <TabsContent value="by-you" className="mt-4 space-y-4">
                      {sharedByYou.map((budget) => {
                        const categoryName =
                          categoryMap.get(budget.categoryId) ??
                          "Unknown Category";
                        return (
                          <SharedBudgetCard
                            key={budget.budgetId}
                            category={categoryName}
                            spent={budget.currentAmount}
                            budget={budget.amount}
                            isShared={true}
                            period={budget.period}
                            sharedWith={
                              sharedUsers[budget.budgetId]
                                ?.filter((u) => u.userUuid !== user?.userUuid)
                                .map((u) => ({
                                  name: u.name,
                                  email: u.email,
                                  avatar: "",
                                })) ?? []
                            }
                          />
                        );
                      })}
                    </TabsContent>
                  )}
                  <TabsContent value="with-you" className="mt-4 space-y-4">
                    {sharedWithYou.map((budget) => {
                      const categoryName =
                        categoryMap.get(budget.categoryId) ??
                        "Unknown Category";
                      return (
                        <SharedBudgetCard
                          key={budget.budgetId}
                          category={categoryName}
                          spent={budget.currentAmount}
                          budget={budget.amount}
                          isShared={true}
                          readonly={true}
                          period={budget.period}
                          sharedWith={
                            sharedUsers[budget.budgetId]
                              ?.filter((u) => u.userUuid !== user?.userUuid)
                              .map((u) => ({
                                name: u.name,
                                email: u.email,
                                avatar: "",
                              })) ?? []
                          }
                        />
                      );
                    })}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Budget: {selectedBudget}</DialogTitle>
            <DialogDescription>
              Share your budget with family members or roommates to collaborate
              on financial planning.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CustomLabel htmlFor="email">Email Address</CustomLabel>
              <div className="flex gap-2">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  className="flex-1"
                />
                <Button>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <CustomLabel>People with Access</CustomLabel>
              <div className="space-y-2">
                {sharedUsers[selectedBudget!]?.map((u) => (
                  <div
                    key={u.userUuid}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {u.name
                            ?.split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {u.name}
                          {u.userUuid === user?.userUuid && " (you)"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-right">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowShareDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowShareDialog(false)}>Share</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ManageCategoriesModal
        open={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        onSuccess={() => {
          console.log("Category successfully created!");
        }}
      />
      <CreateBudgetModal
        open={isCreateBudgetOpen}
        onClose={() => setIsCreateBudgetOpen(false)}
        onSuccess={() => {
          getBudgetsByUserUuid(user!.userUuid).then(setBudgets);
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function CustomLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}

interface BudgetCategoryProps {
  category: string;
  spent: number;
  budget: number;
  icon: React.ReactNode;
  overBudget?: boolean;
  onShare?: () => void;
  isShared?: boolean;
  sharedWith?: Array<{
    name: string;
    email: string;
    avatar: string;
  }>;
  period: string;
}

function BudgetCategory({
  category,
  spent,
  budget,
  icon,
  overBudget = false,
  onShare,
  isShared = false,
  sharedWith = [],
  period,
}: BudgetCategoryProps) {
  const percentage = Math.min(Math.round((spent / budget) * 100), 100);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{category}</span>
                {isShared && (
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    <Users className="h-3 w-3" />
                    Shared
                  </Badge>
                )}
              </div>
              <p className="text-xs pb-1">{period}</p>
              <div className="text-xs text-muted-foreground">
                ${spent.toFixed(2)} of ${budget.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isShared && sharedWith.length > 0 && (
              <div className="flex -space-x-2 mr-2">
                {sharedWith.map((person, index) => (
                  <Avatar
                    key={index}
                    className="border-2 border-background h-6 w-6"
                  >
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {sharedWith.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{sharedWith.length - 3}
                  </div>
                )}
              </div>
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            )}

            <div
              className={`text-sm font-medium ${
                overBudget ? "text-destructive" : ""
              }`}
            >
              {overBudget ? "Over budget" : `${100 - percentage}% left`}
            </div>
          </div>
        </div>

        <Progress
          value={percentage}
          className={overBudget ? "bg-destructive/20" : ""}
        />
      </CardContent>
    </Card>
  );
}

interface BudgetPlanningItemProps {
  name: string;
  amount: number;
}

function BudgetPlanningItem({ name, amount }: BudgetPlanningItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 font-medium">{name}</div>
      <div className="relative w-[150px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          $
        </span>
        <Input
          placeholder="0.00"
          className="pl-7"
          defaultValue={amount.toFixed(2)}
        />
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Settings className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </div>
  );
}
