import { ArrowUpDown, ChevronDown, CreditCard, Download, Filter, PiggyBank, Plus, Search, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountsPage() {
  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage all your financial accounts in one place.</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search accounts..." className="pl-8" />
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
                    <DropdownMenuCheckboxItem checked>Show Active</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Show Closed</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Show Hidden</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="outline" size="sm" className="h-10">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>Showing 5 accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Checking Account</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span>Checking</span>
                        </div>
                      </TableCell>
                      <TableCell>Bank of America</TableCell>
                      <TableCell className="text-right">$5,240.12</TableCell>
                      <TableCell className="text-right">Today, 2:30 PM</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Savings Account</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PiggyBank className="h-4 w-4 text-muted-foreground" />
                          <span>Savings</span>
                        </div>
                      </TableCell>
                      <TableCell>Bank of America</TableCell>
                      <TableCell className="text-right">$7,410.33</TableCell>
                      <TableCell className="text-right">Today, 2:30 PM</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Visa Credit Card</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>Credit Card</span>
                        </div>
                      </TableCell>
                      <TableCell>Chase Bank</TableCell>
                      <TableCell className="text-right text-destructive">-$1,256.78</TableCell>
                      <TableCell className="text-right">Yesterday</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mastercard Credit Card</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>Credit Card</span>
                        </div>
                      </TableCell>
                      <TableCell>Citibank</TableCell>
                      <TableCell className="text-right text-destructive">-$900.00</TableCell>
                      <TableCell className="text-right">Yesterday</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Investment Portfolio</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                          <span>Investment</span>
                        </div>
                      </TableCell>
                      <TableCell>Vanguard</TableCell>
                      <TableCell className="text-right">$13,738.22</TableCell>
                      <TableCell className="text-right">3 days ago</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking" className="space-y-4 mt-4">
            <BankingAccountsTable />
          </TabsContent>

          <TabsContent value="credit" className="space-y-4 mt-4">
            <CreditCardAccountsTable />
          </TabsContent>

          <TabsContent value="investments" className="space-y-4 mt-4">
            <InvestmentAccountsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function BankingAccountsTable() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Banking Accounts</CardTitle>
        <CardDescription>Showing 2 accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Last Updated</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Checking Account</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span>Checking</span>
                </div>
              </TableCell>
              <TableCell>Bank of America</TableCell>
              <TableCell className="text-right">$5,240.12</TableCell>
              <TableCell className="text-right">Today, 2:30 PM</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Savings Account</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                  <span>Savings</span>
                </div>
              </TableCell>
              <TableCell>Bank of America</TableCell>
              <TableCell className="text-right">$7,410.33</TableCell>
              <TableCell className="text-right">Today, 2:30 PM</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CreditCardAccountsTable() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Credit Card Accounts</CardTitle>
        <CardDescription>Showing 2 accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Available Credit</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Visa Credit Card</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Credit Card</span>
                </div>
              </TableCell>
              <TableCell>Chase Bank</TableCell>
              <TableCell className="text-right text-destructive">-$1,256.78</TableCell>
              <TableCell className="text-right">$8,743.22</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Mastercard Credit Card</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Credit Card</span>
                </div>
              </TableCell>
              <TableCell>Citibank</TableCell>
              <TableCell className="text-right text-destructive">-$900.00</TableCell>
              <TableCell className="text-right">$4,100.00</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function InvestmentAccountsTable() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Investment Accounts</CardTitle>
        <CardDescription>Showing 1 account</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead className="text-right">Current Value</TableHead>
              <TableHead className="text-right">Performance (YTD)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Investment Portfolio</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span>Investment</span>
                </div>
              </TableCell>
              <TableCell>Vanguard</TableCell>
              <TableCell className="text-right">$13,738.22</TableCell>
              <TableCell className="text-right text-green-600">+12.4%</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

