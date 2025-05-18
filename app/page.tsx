import { ArrowUpRight, CreditCard, DollarSign, PiggyBank, Plus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">Manage your financial accounts and track your balances.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <PiggyBank className="mr-2 h-4 w-4" />
              Link Account
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Manual Account
            </Button>
          </div>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="credit">Credit Cards</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,231.89</div>
                  <p className="text-xs text-muted-foreground">+$1,204.36 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash & Banking</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,650.45</div>
                  <p className="text-xs text-muted-foreground">3 accounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-$2,156.78</div>
                  <p className="text-xs text-muted-foreground">2 accounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investments</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$13,738.22</div>
                  <p className="text-xs text-muted-foreground">+8.2% this month</p>
                </CardContent>
              </Card>
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-4">Your Accounts</h2>
            <div className="grid gap-4">
              <AccountsList />
            </div>
          </TabsContent>
          <TabsContent value="banking" className="space-y-4 mt-4">
            <BankingAccounts />
          </TabsContent>
          <TabsContent value="credit" className="space-y-4 mt-4">
            <CreditCardAccounts />
          </TabsContent>
          <TabsContent value="investments" className="space-y-4 mt-4">
            <InvestmentAccounts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function AccountsList() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Checking Account</CardTitle>
          <CardDescription>Bank of America</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">$5,240.12</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-lg font-semibold">$5,240.12</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Savings Account</CardTitle>
          <CardDescription>Bank of America</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">$7,410.33</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <p className="text-lg font-semibold">1.25% APY</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Visa Credit Card</CardTitle>
          <CardDescription>Chase Bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-destructive">-$1,256.78</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Credit</p>
              <p className="text-lg font-semibold">$8,743.22</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Vanguard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">$13,738.22</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Performance (YTD)</p>
              <p className="text-lg font-semibold text-green-600">+12.4%</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Holdings
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function BankingAccounts() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Checking Account</CardTitle>
          <CardDescription>Bank of America</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">$5,240.12</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-lg font-semibold">$5,240.12</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Savings Account</CardTitle>
          <CardDescription>Bank of America</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">$7,410.33</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <p className="text-lg font-semibold">1.25% APY</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function CreditCardAccounts() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Visa Credit Card</CardTitle>
          <CardDescription>Chase Bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-destructive">-$1,256.78</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Credit</p>
              <p className="text-lg font-semibold">$8,743.22</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Mastercard Credit Card</CardTitle>
          <CardDescription>Citibank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold text-destructive">-$900.00</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Available Credit</p>
              <p className="text-lg font-semibold">$4,100.00</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function InvestmentAccounts() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Vanguard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">$13,738.22</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Performance (YTD)</p>
              <p className="text-lg font-semibold text-green-600">+12.4%</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            View Holdings
          </Button>
          <Button size="sm">Manage Account</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

