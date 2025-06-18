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
import AddTransactionModal from "@/components/AddTransactionModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Label } from "@/components/ui/label";
import { getAccountsByUserId, getCurrentUser } from "@/lib/userApi";
import { UserResponse } from "@/types/user";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<
    Record<number, { name: string; type: string }>
  >({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [user, setUser] = useState<UserResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const localUser = getCurrentUser();
    if (localUser) {
      setUser(localUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData(user.userId);
    }
  }, [user]);

  async function fetchData(userId: number) {
    try {
      console.log("aee");
      setLoading(true);

      const [transactionsData, categoriesData, accountsData] =
        await Promise.all([
          getTransactions(user!.userId),
          getCategories(),
          getAccountsByUserId(userId),
        ]);

      const categoryMap: Record<number, { name: string; type: string }> = {};
      categoriesData.forEach((c) => {
        categoryMap[c.categoryId] = { name: c.name, type: c.type };
      });

      const accountMap: Record<string, string> = {};
      accountsData.forEach((a) => {
        accountMap[a.accountUuid] = a.name;
      });

      setCategories(categoryMap);
      setAccounts(accountMap);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const visibleTransactions =
    selectedAccount === "all"
      ? transactions
      : transactions.filter((t) => t.accountUuid === selectedAccount);

  const filteredTransactions = visibleTransactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("All Transactions", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const headers = [
      ["Date", "Description", "Category", "Account", "Type", "Amount"],
    ];

    const data = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      categories[t.categoryId]?.name || "Unknown",
      accounts[t.accountUuid] || "Unknown",
      categories[t.categoryId]?.type || "Unknown",
      `$${Math.abs(t.amount).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [22, 163, 74],
      },
    });

    doc.save("transactions.pdf");
  };
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
            {!showDateRange && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDateRange(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            )}
            {showDateRange && (
              <div className="flex flex-wrap md:flex-nowrap items-end gap-3 -mt-3">
                <div className="flex flex-col">
                  <Label htmlFor="dateFrom">From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    className="h-10"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="dateTo">To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    className="h-10"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    className="h-10"
                    onClick={() => {
                      const filtered = transactions.filter((t) => {
                        const tDate = new Date(t.date)
                          .toISOString()
                          .slice(0, 10);
                        return (
                          (!dateFrom || tDate >= dateFrom) &&
                          (!dateTo || tDate <= dateTo)
                        );
                      });
                      setTransactions(filtered);
                    }}
                  >
                    Filter
                  </Button>
                  <Button
                    className="h-10"
                    variant="outline"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setShowDateRange(false);
                      if (user) fetchData(user.userId);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}

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
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {Object.entries(accounts).map(([uuid, name]) => (
                  <SelectItem key={uuid} value={uuid}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-10"
            onClick={exportToPDF}
          >
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
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredTransactions.map((transaction) => (
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
                          {accounts[transaction.accountUuid] || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {categories[transaction.categoryId]?.type ||
                            "Unknown"}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            categories[
                              transaction.categoryId
                            ]?.type.toLowerCase() === "income"
                              ? "text-green-600"
                              : "text-destructive"
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
                              categories[
                                transaction.categoryId
                              ]?.type.toLowerCase() === "income"
                                ? "text-green-600"
                                : "text-destructive"
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
                              categories[
                                transaction.categoryId
                              ]?.type.toLowerCase() === "income"
                                ? "text-green-600"
                                : "text-destructive"
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
          if (user) fetchData(user.userId);
        }}
        userId={user ? user.userId : null}
      />
    </div>
  );
}
