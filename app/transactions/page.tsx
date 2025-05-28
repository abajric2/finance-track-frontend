"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Download,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction } from "@/types/transaction";
import { getCategories, getTransactions } from "@/lib/transactionApi";
import { getAccounts } from "@/lib/userApi";
import AddTransactionModal from "@/components/AddTransactionModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*const transactions = [
  {
    id: "t1",
    date: "2023-06-15",
    description: "Grocery Store",
    category: "Groceries",
    account: "Checking Account",
    amount: -120.45,
  },
  {
    id: "t2",
    date: "2023-06-14",
    description: "Salary Deposit",
    category: "Income",
    account: "Checking Account",
    amount: 2500.0,
  },
  {
    id: "t3",
    date: "2023-06-12",
    description: "Electric Bill",
    category: "Utilities",
    account: "Checking Account",
    amount: -85.2,
  },
  {
    id: "t4",
    date: "2023-06-10",
    description: "Restaurant",
    category: "Dining",
    account: "Credit Card",
    amount: -64.3,
  },
  {
    id: "t5",
    date: "2023-06-08",
    description: "Gas Station",
    category: "Transportation",
    account: "Credit Card",
    amount: -45.0,
  },
  {
    id: "t6",
    date: "2023-06-05",
    description: "Online Shopping",
    category: "Shopping",
    account: "Credit Card",
    amount: -129.99,
  },
  {
    id: "t7",
    date: "2023-06-03",
    description: "Gym Membership",
    category: "Health & Fitness",
    account: "Checking Account",
    amount: -50.0,
  },
  {
    id: "t8",
    date: "2023-06-01",
    description: "Rent Payment",
    category: "Housing",
    account: "Checking Account",
    amount: -1200.0,
  },
]*/

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<
    Record<number, { name: string; type: string }>
  >({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);

      const categoryMap: Record<number, { name: string; type: string }> = {};
      categoriesData.forEach((c) => {
        categoryMap[c.categoryId] = { name: c.name, type: c.type };
      });

      setCategories(categoryMap);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your financial transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-8" />
            </div>

            <Select defaultValue="all-accounts">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-accounts">All Accounts</SelectItem>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="h-10">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  Showing all transactions from all accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {categories[transaction.categoryId]?.name ||
                            "Unknown"}
                        </TableCell>
                        <TableCell>
                          {categories[transaction.categoryId]?.type ||
                            "Unknown"}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            transaction.amount < 0
                              ? "text-destructive"
                              : "text-green-600"
                          }`}
                        >
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Income Transactions</CardTitle>
                <CardDescription>
                  Showing all income transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter(
                        (t) =>
                          categories[t.categoryId]?.type.toLowerCase() ===
                          "income"
                      )
                      .map((transaction) => (
                        <TableRow key={transaction.transactionId}>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {categories[transaction.categoryId]?.name ||
                              "Unknown"}
                          </TableCell>
                          <TableCell>
                            {categories[transaction.categoryId]?.type ||
                              "Unknown"}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              transaction.amount < 0
                                ? "text-destructive"
                                : "text-green-600"
                            }`}
                          >
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Expense Transactions</CardTitle>
                <CardDescription>
                  Showing all expense transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter(
                        (t) =>
                          categories[t.categoryId]?.type.toLowerCase() ===
                          "expense"
                      )
                      .map((transaction) => (
                        <TableRow key={transaction.transactionId}>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            {categories[transaction.categoryId]?.name ||
                              "Unknown"}
                          </TableCell>
                          <TableCell>
                            {categories[transaction.categoryId]?.type ||
                              "Unknown"}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              transaction.amount < 0
                                ? "text-destructive"
                                : "text-green-600"
                            }`}
                          >
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Pending Transactions</CardTitle>
                <CardDescription>
                  Showing all pending transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <DollarSign className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No pending transactions</p>
                  <p className="text-sm">
                    All your transactions have been processed
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AddTransactionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchData();
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
      />
    </div>
  );
}
