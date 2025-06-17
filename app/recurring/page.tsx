"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  CreditCard,
  Edit,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ExtendedRecurringTransaction,
  PeriodicTransaction,
  Transaction,
} from "@/types/transaction";
import { getCurrentUser } from "@/lib/userApi";
import {
  getCategories,
  getExtendedRecurringTransactions,
} from "@/lib/transactionApi";
import { getNextRecurringDate } from "@/utils/getNextRecurringDate";

export default function RecurringTransactionsPage() {
  const [showAddRecurringDialog, setShowAddRecurringDialog] = useState(false);
  const [showProjectionDialog, setShowProjectionDialog] = useState(false);
  const [recurringTransactions, setRecurringTransactions] = useState<
    ExtendedRecurringTransaction[]
  >([]);
  const [categories, setCategories] = useState<
    Record<number, { name: string; type: string }>
  >({});

  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.userId) return;

    Promise.all([
      getExtendedRecurringTransactions(user.userId),
      getCategories(),
    ])
      .then(([recTransactions, fetchedCategories]) => {
        setRecurringTransactions(recTransactions);

        const categoryMap: Record<number, { name: string; type: string }> = {};
        fetchedCategories.forEach((c) => {
          categoryMap[c.categoryId] = { name: c.name, type: c.type };
        });
        setCategories(categoryMap);
      })
      .catch((err) =>
        console.error("Error fetching extended recurring transactions", err)
      );
  }, []);

  const recurringIncome = recurringTransactions.filter(
    (rec) =>
      categories[rec.transaction?.categoryId]?.type?.toLowerCase() === "income"
  );

  const recurringExpenses = recurringTransactions.filter(
    (rec) =>
      categories[rec.transaction?.categoryId]?.type?.toLowerCase() === "expense"
  );

  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Recurring Transactions
            </h1>
            <p className="text-muted-foreground">
              Manage your regular income and expenses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAddRecurringDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Recurring</CardTitle>
              <CardDescription>Total recurring transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-2">
                8 expenses, 4 income
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Outflow</CardTitle>
              <CardDescription>Recurring expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                -$2,345.00
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Next: Rent ($1,200) on July 1
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Inflow</CardTitle>
              <CardDescription>Recurring income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +$5,800.00
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Next: Salary ($4,500) on June 30
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all">All Recurring</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search recurring..." className="pl-8" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuCheckboxItem checked>
                    All Frequencies
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Monthly</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Weekly</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Yearly</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Recurring Transactions</CardTitle>
                <CardDescription>
                  Showing all your recurring transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurringTransactions.map((rec) => {
                      const firstTransaction = rec.transaction;
                      const amount = firstTransaction?.amount || 0;
                      const category =
                        categories[firstTransaction?.categoryId]?.name;
                      const isIncome =
                        categories[
                          firstTransaction?.categoryId
                        ]?.type.toLocaleLowerCase() === "income";
                      return (
                        <TableRow
                          key={`${rec.periodic.periodicTransactionId}-${rec.transaction.transactionId}`}
                        >
                          <TableCell className="font-medium">
                            {firstTransaction?.description || "N/A"}
                          </TableCell>
                          <TableCell>{category}</TableCell>
                          <TableCell>{rec.periodic.frequency}</TableCell>
                          <TableCell>
                            {rec.periodic.startDate && rec.periodic.frequency
                              ? getNextRecurringDate(
                                  rec.periodic.startDate,
                                  rec.periodic.frequency
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {isIncome ? "Income" : "Expense"}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right",
                              isIncome ? "text-green-600" : "text-destructive"
                            )}
                          >
                            ${Math.abs(amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recurring Income</CardTitle>
                <CardDescription>
                  Showing all your recurring income sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurringIncome.map((rec) => {
                      const tx = rec.transaction;
                      const amount = tx?.amount || 0;
                      const category =
                        categories[tx?.categoryId]?.name || "Uncategorized";
                      const isIncome =
                        categories[tx?.categoryId]?.type?.toLowerCase() ===
                        "income";

                      return (
                        <TableRow
                          key={`${rec.periodic.periodicTransactionId}-${tx.transactionId}`}
                        >
                          <TableCell className="font-medium">
                            {tx?.description || "N/A"}
                          </TableCell>
                          <TableCell>{category}</TableCell>
                          <TableCell>{rec.periodic.frequency}</TableCell>
                          <TableCell>
                            {rec.periodic.startDate && rec.periodic.frequency
                              ? getNextRecurringDate(
                                  rec.periodic.startDate,
                                  rec.periodic.frequency
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {isIncome ? "Income" : "Expense"}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              isIncome ? "text-green-600" : "text-destructive"
                            }`}
                          >
                            ${Math.abs(amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recurring Expenses</CardTitle>
                <CardDescription>
                  Showing all your recurring expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurringExpenses.map((rec) => {
                      const tx = rec.transaction;
                      const amount = tx?.amount || 0;
                      const category =
                        categories[tx?.categoryId]?.name || "Uncategorized";
                      const isIncome =
                        categories[tx?.categoryId]?.type?.toLowerCase() ===
                        "income";

                      return (
                        <TableRow
                          key={`${rec.periodic.periodicTransactionId}-${tx.transactionId}`}
                        >
                          <TableCell className="font-medium">
                            {tx?.description || "N/A"}
                          </TableCell>
                          <TableCell>{category}</TableCell>
                          <TableCell>{rec.periodic.frequency}</TableCell>
                          <TableCell>
                            {rec.periodic.startDate && rec.periodic.frequency
                              ? getNextRecurringDate(
                                  rec.periodic.startDate,
                                  rec.periodic.frequency
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {isIncome ? "Income" : "Expense"}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              isIncome ? "text-green-600" : "text-destructive"
                            }`}
                          >
                            ${Math.abs(amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Recurring Transaction Dialog */}
      <Dialog
        open={showAddRecurringDialog}
        onOpenChange={setShowAddRecurringDialog}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Recurring Transaction</DialogTitle>
            <DialogDescription>
              Set up a new recurring transaction to track regular income or
              expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-name">Transaction Name</Label>
              <Input
                id="transaction-name"
                placeholder="e.g. Rent, Salary, Netflix, etc."
              />
            </div>

            <div className="grid gap-2">
              <Label>Transaction Type</Label>
              <RadioGroup defaultValue="expense" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="flex items-center">
                    <ArrowUp className="mr-2 h-4 w-4 text-destructive" />
                    Expense
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="flex items-center">
                    <ArrowDown className="mr-2 h-4 w-4 text-green-600" />
                    Income
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input id="amount" placeholder="0.00" className="pl-7" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select>
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="auto-track" />
              <Label htmlFor="auto-track">
                Automatically track this transaction
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddRecurringDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowAddRecurringDialog(false)}>
              Add Recurring Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Projection Dialog */}
      <Dialog
        open={showProjectionDialog}
        onOpenChange={setShowProjectionDialog}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Cash Flow Projections</DialogTitle>
            <DialogDescription>
              View your projected account balances based on recurring
              transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Projection Period</h3>
                <p className="text-xs text-muted-foreground">
                  June 20 - July 20, 2023
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Next 7 days</SelectItem>
                  <SelectItem value="30">Next 30 days</SelectItem>
                  <SelectItem value="90">Next 90 days</SelectItem>
                  <SelectItem value="180">Next 6 months</SelectItem>
                  <SelectItem value="365">Next 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <div className="flex items-center justify-between bg-muted p-4">
                <div className="grid gap-1">
                  <h3 className="text-sm font-medium">Checking Account</h3>
                  <p className="text-xs text-muted-foreground">
                    Bank of America
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Current Balance: $5,240.12
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Projected on July 20: $7,125.13
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">June 23, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <p className="text-sm">Freelance Income</p>
                        <Badge className="bg-green-100 text-green-800">
                          +$250.00
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">$5,490.12</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">June 30, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <p className="text-sm">Salary</p>
                        <Badge className="bg-green-100 text-green-800">
                          +$4,500.00
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">$9,990.12</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">July 1, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <p className="text-sm">Rent</p>
                        <Badge className="bg-red-100 text-red-800">
                          -$1,200.00
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">$8,790.12</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">July 1, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <p className="text-sm">Rental Income</p>
                        <Badge className="bg-green-100 text-green-800">
                          +$800.00
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">$9,590.12</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">July 5, 2023</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <p className="text-sm">Gym Membership</p>
                        <Badge className="bg-red-100 text-red-800">
                          -$50.00
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">$9,540.12</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      ... and 8 more transactions
                    </p>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Projection
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Projected Net Cash Flow</h3>
                <p className="text-xs text-muted-foreground">
                  For the selected period
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">+$1,885.01</p>
                <p className="text-xs text-muted-foreground">
                  $5,870.00 income, $3,984.99 expenses
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProjectionDialog(false)}
            >
              Close
            </Button>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              View All Accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
