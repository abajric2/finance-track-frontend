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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { getAccountsByUserId, getCurrentUser } from "@/lib/userApi";
import {
  createPeriodicTransaction,
  createTransaction,
  getCategories,
  getExtendedRecurringTransactions,
} from "@/lib/transactionApi";
import { getNextRecurringDate } from "@/utils/getNextRecurringDate";
import { toast } from "react-toastify";
import { getBudgetsByUserUuid, getCategoryById } from "@/lib/budgetApi";
import { v4 as uuidv4 } from "uuid";

export default function RecurringTransactionsPage() {
  const [showAddRecurringDialog, setShowAddRecurringDialog] = useState(false);
  const [showProjectionDialog, setShowProjectionDialog] = useState(false);
  const [recurringTransactions, setRecurringTransactions] = useState<
    ExtendedRecurringTransaction[]
  >([]);
  const [categories, setCategories] = useState<
    Record<number, { name: string; type: string }>
  >({});
  const [frequencyFilter, setFrequencyFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
    budgetId: "",
    frequency: "",
    startDate: "",
    endDate: "",
    accountId: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filterTransactions = (transactions: ExtendedRecurringTransaction[]) =>
    transactions.filter((rec) => {
      const matchesFrequency =
        !frequencyFilter ||
        rec.periodic.frequency?.toLowerCase() === frequencyFilter;

      const matchesSearch =
        rec.transaction?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ?? false;

      return matchesFrequency && matchesSearch;
    });

  useEffect(() => {
    setFormData({
      name: "",
      amount: "",
      categoryId: "",
      budgetId: "",
      frequency: "",
      startDate: "",
      endDate: "",
      accountId: "",
    });
    const fetchData = async () => {
      const user = getCurrentUser();
      if (!user) {
        toast.error("User not found. Please log in again.");
        return;
      }

      try {
        const [recTransactions, fetchedCategories, fetchedAccounts] =
          await Promise.all([
            getExtendedRecurringTransactions(user.userId),
            getCategories(),
            getAccountsByUserId(user.userId),
          ]);

        setRecurringTransactions(recTransactions);
        setCategories(fetchedCategories);
        setAccounts(fetchedAccounts);

        const budgets = await getBudgetsByUserUuid(user.userUuid);

        const categoryMapForBudgets: Record<number, string> = {};
        for (const budget of budgets) {
          if (budget.categoryId && !categoryMapForBudgets[budget.categoryId]) {
            try {
              const category = await getCategoryById(budget.categoryId);
              categoryMapForBudgets[budget.categoryId] =
                category.name.split("---")[0];
            } catch (err) {
              console.error("Error fetching category for budget:", err);
            }
          }
        }

        const enrichedBudgets = budgets.map((budget) => ({
          ...budget,
          categoryName: categoryMapForBudgets[budget.categoryId] || "Unknown",
        }));

        setBudgets(enrichedBudgets);
      } catch (err) {
        console.error("Failed to load recurring data:", err);
        toast.error("Could not load recurring transactions or metadata.");
      }
    };

    fetchData();
  }, []);

  const handleAddRecurringTransaction = async () => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("User not found.");
      return;
    }

    try {
      const periodic = await createPeriodicTransaction({
        frequency: formData.frequency,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
      });
      const today = new Date().toISOString().split("T")[0];

      const transactionPayload = {
        transactionUuid: uuidv4(),
        amount: Number(formData.amount),
        date: today,
        description: formData.name,
        accountUuid: accounts.find(
          (acc) => acc.accountId === Number(formData.accountId)
        )?.accountUuid,
        categoryId: Number(formData.categoryId),
        budgetUuid: budgets.find(
          (b) => b.budgetId === Number(formData.budgetId)
        )?.budgetUuid,
        periodicTransactionId: periodic.periodicTransactionId,
      };

      await createTransaction(transactionPayload);

      const updated = await getExtendedRecurringTransactions(user.userId);
      setRecurringTransactions(updated);

      toast.success("Recurring transaction added successfully!");
      setShowAddRecurringDialog(false);
      setFormData({
        name: "",
        amount: "",
        categoryId: "",
        budgetId: "",
        frequency: "",
        startDate: "",
        endDate: "",
        accountId: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add recurring transaction.");
    }
  };

  const recurringIncome = recurringTransactions.filter(
    (rec) =>
      categories[rec.transaction?.categoryId]?.type?.toLowerCase() === "income"
  );

  const recurringExpenses = recurringTransactions.filter(
    (rec) =>
      categories[rec.transaction?.categoryId]?.type?.toLowerCase() === "expense"
  );

  const filteredAll = filterTransactions(recurringTransactions);
  const filteredIncome = filterTransactions(recurringIncome);
  const filteredExpenses = filterTransactions(recurringExpenses);

  const totalRecurring = recurringTransactions.length;

  const totalIncomeTransactions = recurringTransactions.filter(
    (rec) =>
      categories[rec.transaction?.categoryId]?.type?.toLowerCase() === "income"
  );

  const totalExpenseTransactions = recurringTransactions.filter(
    (rec) =>
      categories[rec.transaction?.categoryId]?.type?.toLowerCase() === "expense"
  );

  const totalIncomeAmount = totalIncomeTransactions.reduce(
    (sum, rec) => sum + (rec.transaction?.amount || 0),
    0
  );

  const totalExpenseAmount = totalExpenseTransactions.reduce(
    (sum, rec) => sum + (rec.transaction?.amount || 0),
    0
  );

  const nextIncome = [...totalIncomeTransactions]
    .map((rec) => ({
      ...rec,
      nextDateString: getNextRecurringDate(
        rec.periodic.startDate,
        rec.periodic.frequency
      ),
      nextDate: new Date(
        getNextRecurringDate(rec.periodic.startDate, rec.periodic.frequency)
      ),
    }))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())[0];

  const nextExpense = [...totalExpenseTransactions]
    .map((rec) => ({
      ...rec,
      nextDateString: getNextRecurringDate(
        rec.periodic.startDate,
        rec.periodic.frequency
      ),
      nextDate: new Date(
        getNextRecurringDate(rec.periodic.startDate, rec.periodic.frequency)
      ),
    }))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())[0];

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
              <CardTitle>Total Recurring</CardTitle>
              <CardDescription>All recurring transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecurring}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalExpenseTransactions.length} expenses,{" "}
                {totalIncomeTransactions.length} income
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Outflow</CardTitle>
              <CardDescription>All recurring expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                -${totalExpenseAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {nextExpense
                  ? `Next: ${nextExpense.transaction?.description} ($${nextExpense.transaction?.amount}) on ${nextExpense.nextDateString}`
                  : "No upcoming expense"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Inflow</CardTitle>
              <CardDescription>All recurring income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${totalIncomeAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {nextIncome
                  ? `Next: ${nextIncome.transaction?.description} ($${nextIncome.transaction?.amount}) on ${nextIncome.nextDateString}`
                  : "No upcoming income"}
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
                <Input
                  placeholder="Search recurring..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  <DropdownMenuRadioGroup
                    value={frequencyFilter || "all"}
                    onValueChange={(value) =>
                      setFrequencyFilter(value === "all" ? null : value)
                    }
                  >
                    <DropdownMenuRadioItem value="all">
                      All Frequencies
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="monthly">
                      Monthly
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="weekly">
                      Weekly
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="yearly">
                      Yearly
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
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
                    {filteredAll.map((rec) => {
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
                    {filteredIncome.map((rec) => {
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
                    {filteredExpenses.map((rec) => {
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
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Rent, Salary, Netflix, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) => handleChange("categoryId", val)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories)
                      .filter(([, cat]) => cat.name.toLowerCase() !== "save")
                      .map(([id, cat]) => (
                        <SelectItem key={id} value={id}>
                          {cat.name} ({cat.type.toLowerCase()})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Select
                value={formData.budgetId}
                onValueChange={(val) => handleChange("budgetId", val)}
              >
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem
                      key={budget.budgetId}
                      value={String(budget.budgetId)}
                    >
                      {budget.categoryName || "Unnamed"} - {budget.period} - $
                      {budget.amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(val) => handleChange("frequency", val)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select
                value={formData.accountId}
                onValueChange={(val) => handleChange("accountId", val)}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem
                      key={acc.accountId}
                      value={String(acc.accountId)}
                    >
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddRecurringDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddRecurringTransaction}>
              Add Recurring Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
