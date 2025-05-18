import { ArrowLeft, ChevronRight, CreditCard, Download, Edit, PiggyBank, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  // This is a mock implementation - in a real app, you would fetch the account data based on the ID
  const accountData = {
    id: params.id,
    name: "Checking Account",
    type: "checking",
    institution: "Bank of America",
    balance: 5240.12,
    availableBalance: 5240.12,
    accountNumber: "****4567",
    routingNumber: "123456789",
    lastUpdated: "Today, 2:30 PM",
    transactions: [
      {
        id: "t1",
        date: "2023-06-15",
        description: "Grocery Store",
        category: "Groceries",
        amount: -120.45,
      },
      {
        id: "t2",
        date: "2023-06-14",
        description: "Salary Deposit",
        category: "Income",
        amount: 2500.0,
      },
      {
        id: "t3",
        date: "2023-06-12",
        description: "Electric Bill",
        category: "Utilities",
        amount: -85.2,
      },
      {
        id: "t4",
        date: "2023-06-10",
        description: "Restaurant",
        category: "Dining",
        amount: -64.3,
      },
      {
        id: "t5",
        date: "2023-06-08",
        description: "Gas Station",
        category: "Transportation",
        amount: -45.0,
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/accounts">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{accountData.name}</h1>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PiggyBank className="h-4 w-4" />
                  <span>{accountData.institution}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Account #{accountData.accountNumber}</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Account
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Last updated: {accountData.lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-2xl font-bold">${accountData.balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold">${accountData.availableBalance.toFixed(2)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Type</span>
                      <span className="font-medium">Checking</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Account Number</span>
                      <span className="font-medium">{accountData.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Routing Number</span>
                      <span className="font-medium">{accountData.routingNumber}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Statement
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <Button className="h-24 flex-col items-center justify-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    <span>Transfer Money</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col items-center justify-center gap-2">
                    <Download className="h-6 w-6" />
                    <span>Download Transactions</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col items-center justify-center gap-2">
                    <Edit className="h-6 w-6" />
                    <span>Edit Account Details</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col items-center justify-center gap-2">
                    <Trash2 className="h-6 w-6" />
                    <span>Hide Account</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                <TabsTrigger value="details">Account Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Showing the last 5 transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountData.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell
                              className={`text-right ${transaction.amount < 0 ? "text-destructive" : "text-green-600"}`}
                            >
                              ${Math.abs(transaction.amount).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Complete information about this account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Account Name</p>
                        <p className="font-medium">{accountData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Type</p>
                        <p className="font-medium">Checking</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Institution</p>
                        <p className="font-medium">{accountData.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Number</p>
                        <p className="font-medium">{accountData.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Routing Number</p>
                        <p className="font-medium">{accountData.routingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{accountData.lastUpdated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Account Visibility</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Show in Dashboard</span>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Include in Totals</span>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-medium">Notifications</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Low Balance Alerts</span>
                        <Button variant="outline" size="sm">
                          Disabled
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Transaction Alerts</span>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

