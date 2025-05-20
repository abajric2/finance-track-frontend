"use client";

import { DollarSign, PiggyBank, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Account, AccountType } from "@/types/account";
import currency from "currency.js";
import getSymbolFromCurrency from "currency-symbol-map";
import AddAccountModal from "@/components/AddAccountModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccountsByUserId, getCurrentUser } from "@/lib/userApi";
import ManageAccountModal from "@/components/ManageAccountModal";

const accountTypes: AccountType[] = [
  "SAVINGS",
  "CHECKING",
  "INVESTMENT",
  "CREDIT",
];

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const refreshAccounts = async () => {
    const user = getCurrentUser();
    if (user?.userId) {
      const data = await getAccountsByUserId(user.userId);
      setAccounts(data);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();

    if (user?.userId) {
      getAccountsByUserId(user.userId)
        .then(setAccounts)
        .catch((err) => console.error(err));
    }
  }, []);

  const getTotalForType = (type?: AccountType) => {
    const filtered = type ? accounts.filter((a) => a.type === type) : accounts;
    const total = filtered.reduce((acc, a) => acc + a.balance, 0);
    return {
      total: currency(total, { symbol: "", precision: 2 }).format(),
      count: filtered.length,
      currencySymbol: filtered[0]?.currencyCode
        ? getSymbolFromCurrency(filtered[0].currencyCode) ||
          filtered[0].currencyCode
        : "$",
    };
  };

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
              <p className="text-muted-foreground">
                Manage your financial accounts and track your balances.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <PiggyBank className="mr-2 h-4 w-4" />
                Link Account
              </Button>
              <Button onClick={() => setShowModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Manual Account
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 md:w-auto">
              <TabsTrigger value="all">All Accounts</TabsTrigger>
              {accountTypes.map((type) => (
                <TabsTrigger key={type} value={type.toLowerCase()}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {["all", ...accountTypes.map((t) => t.toLowerCase())].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
                {tab === "all" && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            All Accounts
                          </CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {getSymbolFromCurrency(
                              accounts[0]?.currencyCode || "USD"
                            ) || "$"}
                            {getTotalForType().total}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getTotalForType().count} accounts
                          </p>
                        </CardContent>
                      </Card>

                      {accountTypes.map((type) => {
                        const totalData = getTotalForType(type);
                        return (
                          <Card key={type}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                {type.charAt(0) + type.slice(1).toLowerCase()}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">
                                {totalData.currencySymbol}
                                {totalData.total}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {totalData.count} accounts
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <h2 className="text-xl font-semibold mt-6 mb-4">
                      Your Accounts
                    </h2>
                  </>
                )}

                {tab !== "all" && (
                  <h2 className="text-xl font-semibold mt-2 mb-4">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Accounts
                  </h2>
                )}

                <div className="grid gap-4">
                  <AccountsList
                    accounts={
                      tab === "all"
                        ? accounts
                        : accounts.filter((a) => a.type === tab.toUpperCase())
                    }
                    onManage={(acc) => setSelectedAccount(acc)}
                    refreshAccounts={refreshAccounts}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <AddAccountModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={refreshAccounts}
      />
      {selectedAccount && (
        <ManageAccountModal
          open={!!selectedAccount}
          onClose={() => setSelectedAccount(null)}
          account={selectedAccount}
          onSuccess={() => {
            refreshAccounts();
            setSelectedAccount(null);
          }}
        />
      )}
    </ProtectedRoute>
  );
}

function AccountsList({
  accounts,
  onManage,
  refreshAccounts,
}: {
  accounts: Account[];
  onManage: (acc: Account) => void;
  refreshAccounts: () => void;
}) {
  return (
    <div className="grid gap-4">
      {accounts.map((acc) => (
        <Card key={acc.accountId}>
          <CardHeader className="pb-2">
            <CardTitle>{acc.name}</CardTitle>
            <CardDescription>{acc.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">
                {(() => {
                  const code = acc.currencyEntity?.code ?? acc.currencyCode;
                  return getSymbolFromCurrency(code) ?? code ?? "$";
                })()}
                {currency(acc.balance, { symbol: "", precision: 2 }).format()}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button size="sm" onClick={() => onManage(acc)}>
              Manage Account
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
