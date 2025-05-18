import { ArrowDownToLine, BarChart, ChevronDown, Filter, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
            <p className="text-muted-foreground">Analyze your financial data and generate insights.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="last-30-days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="year-to-date">Year to Date</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem checked>All Accounts</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>All Categories</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Include Transfers</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Income</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,240.00</div>
              <p className="text-xs text-green-600 mt-1">+12% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Expenses</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,450.00</div>
              <p className="text-xs text-destructive mt-1">+8% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Net Savings</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,790.00</div>
              <p className="text-xs text-green-600 mt-1">+22% from previous period</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income-expenses">Income & Expenses</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Income vs. Expenses over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-12 w-12 mb-4" />
                    <p>Income vs. Expenses chart would appear here</p>
                    <p className="text-sm">Showing monthly comparison over the selected period</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Income Sources</CardTitle>
                  <CardDescription>Where your money comes from</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-12 w-12 mb-4" />
                    <p>Income sources chart would appear here</p>
                    <p className="text-sm">Showing breakdown of income categories</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Expense Categories</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-12 w-12 mb-4" />
                    <p>Expense categories chart would appear here</p>
                    <p className="text-sm">Showing breakdown of expense categories</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income-expenses" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Income vs. Expenses</CardTitle>
                <CardDescription>Detailed breakdown by month</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="mx-auto h-12 w-12 mb-4" />
                  <p>Monthly income and expenses chart would appear here</p>
                  <p className="text-sm">Showing detailed monthly comparison</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Income Details</CardTitle>
                  <CardDescription>Breakdown by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <IncomeExpenseItem name="Salary" amount={4500} percentage={85.9} />
                    <IncomeExpenseItem name="Freelance Work" amount={450} percentage={8.6} />
                    <IncomeExpenseItem name="Investments" amount={180} percentage={3.4} />
                    <IncomeExpenseItem name="Other" amount={110} percentage={2.1} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Details</CardTitle>
                  <CardDescription>Breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <IncomeExpenseItem name="Housing" amount={1200} percentage={34.8} />
                    <IncomeExpenseItem name="Food & Dining" amount={850} percentage={24.6} />
                    <IncomeExpenseItem name="Transportation" amount={350} percentage={10.1} />
                    <IncomeExpenseItem name="Entertainment" amount={420} percentage={12.2} />
                    <IncomeExpenseItem name="Shopping" amount={280} percentage={8.1} />
                    <IncomeExpenseItem name="Utilities" amount={180} percentage={5.2} />
                    <IncomeExpenseItem name="Other" amount={170} percentage={4.9} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Visual breakdown of your expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChart className="mx-auto h-12 w-12 mb-4" />
                  <p>Category breakdown chart would appear here</p>
                  <p className="text-sm">Showing detailed category analysis</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>Current vs. Previous Period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <CategoryComparisonItem name="Housing" currentAmount={1200} previousAmount={1200} change={0} />
                  <CategoryComparisonItem
                    name="Food & Dining"
                    currentAmount={850}
                    previousAmount={780}
                    change={9}
                    increased
                  />
                  <CategoryComparisonItem
                    name="Transportation"
                    currentAmount={350}
                    previousAmount={420}
                    change={-16.7}
                  />
                  <CategoryComparisonItem
                    name="Entertainment"
                    currentAmount={420}
                    previousAmount={350}
                    change={20}
                    increased
                  />
                  <CategoryComparisonItem name="Shopping" currentAmount={280} previousAmount={320} change={-12.5} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
                <CardDescription>Long-term financial patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="mx-auto h-12 w-12 mb-4" />
                  <p>Financial trends chart would appear here</p>
                  <p className="text-sm">Showing long-term financial patterns</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Net Worth Trend</CardTitle>
                  <CardDescription>Assets minus liabilities over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-12 w-12 mb-4" />
                    <p>Net worth trend chart would appear here</p>
                    <p className="text-sm">Showing growth in net worth over time</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Savings Rate</CardTitle>
                  <CardDescription>Percentage of income saved over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-12 w-12 mb-4" />
                    <p>Savings rate chart would appear here</p>
                    <p className="text-sm">Showing percentage of income saved each month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function IncomeExpenseItem({ name, amount, percentage }: { name: string; amount: number; percentage: number }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</div>
      </div>
      <div className="text-right font-medium">${amount.toFixed(2)}</div>
    </div>
  )
}

function CategoryComparisonItem({
  name,
  currentAmount,
  previousAmount,
  change,
  increased = false,
}: {
  name: string
  currentAmount: number
  previousAmount: number
  change: number
  increased?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">
          ${previousAmount.toFixed(2)} → ${currentAmount.toFixed(2)}
        </div>
      </div>
      <div className={`text-right font-medium ${increased ? "text-destructive" : "text-green-600"}`}>
        {change === 0 ? "No change" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
      </div>
    </div>
  )
}

