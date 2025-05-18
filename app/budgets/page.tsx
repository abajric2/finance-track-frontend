"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Filter, PiggyBank, Plus, Search, Settings, Share2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

export default function BudgetsPage() {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)

  const handleShareBudget = (budgetName: string) => {
    setSelectedBudget(budgetName)
    setShowShareDialog(true)
  }

  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
            <p className="text-muted-foreground">Track your spending and stay within your budget.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="june-2023">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="june-2023">June 2023</SelectItem>
                <SelectItem value="may-2023">May 2023</SelectItem>
                <SelectItem value="april-2023">April 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Budget</CardTitle>
              <CardDescription>Monthly overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,450 / $5,000</div>
              <Progress value={69} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">69% of monthly budget used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Remaining</CardTitle>
              <CardDescription>Available to spend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,550</div>
              <Progress value={31} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">31% of monthly budget remaining</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Daily Budget</CardTitle>
              <CardDescription>Recommended daily spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$51.67</div>
              <p className="text-xs text-muted-foreground mt-2">For the next 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="categories">Budget Categories</TabsTrigger>
            <TabsTrigger value="trends">Budget Trends</TabsTrigger>
            <TabsTrigger value="planning">Budget Planning</TabsTrigger>
            <TabsTrigger value="shared">Shared Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search categories..." className="pl-8" />
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
                    <DropdownMenuCheckboxItem checked>Show All</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Over Budget</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Under Budget</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </div>

            <div className="space-y-4">
              <BudgetCategory
                name="Housing"
                spent={1200}
                budget={1500}
                icon={<PiggyBank className="h-4 w-4" />}
                onShare={() => handleShareBudget("Housing")}
                isShared={true}
                sharedWith={[{ name: "Sarah Johnson", email: "sarah@example.com", avatar: "/avatars/01.png" }]}
              />
              <BudgetCategory
                name="Food & Dining"
                spent={850}
                budget={800}
                icon={<PiggyBank className="h-4 w-4" />}
                overBudget
                onShare={() => handleShareBudget("Food & Dining")}
              />
              <BudgetCategory
                name="Transportation"
                spent={350}
                budget={400}
                icon={<PiggyBank className="h-4 w-4" />}
                onShare={() => handleShareBudget("Transportation")}
              />
              <BudgetCategory
                name="Entertainment"
                spent={420}
                budget={300}
                icon={<PiggyBank className="h-4 w-4" />}
                overBudget
                onShare={() => handleShareBudget("Entertainment")}
                isShared={true}
                sharedWith={[
                  { name: "Mike Smith", email: "mike@example.com", avatar: "/avatars/02.png" },
                  { name: "Emma Davis", email: "emma@example.com", avatar: "/avatars/03.png" },
                ]}
              />
              <BudgetCategory
                name="Shopping"
                spent={280}
                budget={500}
                icon={<PiggyBank className="h-4 w-4" />}
                onShare={() => handleShareBudget("Shopping")}
              />
              <BudgetCategory
                name="Utilities"
                spent={180}
                budget={250}
                icon={<PiggyBank className="h-4 w-4" />}
                onShare={() => handleShareBudget("Utilities")}
              />
              <BudgetCategory
                name="Health & Fitness"
                spent={120}
                budget={200}
                icon={<PiggyBank className="h-4 w-4" />}
                onShare={() => handleShareBudget("Health & Fitness")}
              />
              <BudgetCategory
                name="Personal Care"
                spent={50}
                budget={150}
                icon={<PiggyBank className="h-4 w-4" />}
                onShare={() => handleShareBudget("Personal Care")}
              />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget Trends</CardTitle>
                <CardDescription>Compare your spending over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ArrowUpDown className="mx-auto h-12 w-12 mb-4" />
                  <p>Budget trend visualization would appear here</p>
                  <p className="text-sm">Showing monthly spending patterns and trends</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planning" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>Plan your budget for upcoming months</CardDescription>
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
                          <SelectItem value="august-2023">August 2023</SelectItem>
                          <SelectItem value="september-2023">September 2023</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <CustomLabel>Total Budget</CustomLabel>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          $
                        </span>
                        <Input placeholder="5,000.00" className="pl-7" defaultValue="5,000.00" />
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
                      <BudgetPlanningItem name="Health & Fitness" amount={200} />
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
                <CardDescription>Manage budgets shared with you and by you</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="by-you">
                  <TabsList>
                    <TabsTrigger value="by-you">Shared by You</TabsTrigger>
                    <TabsTrigger value="with-you">Shared with You</TabsTrigger>
                  </TabsList>
                  <TabsContent value="by-you" className="mt-4 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Housing</h3>
                          <p className="text-sm text-muted-foreground">$1,200 of $1,500</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <Avatar className="border-2 border-background h-8 w-8">
                              <AvatarImage src="/avatars/01.png" alt="Sarah Johnson" />
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                          </div>
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Manage
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Entertainment</h3>
                          <p className="text-sm text-muted-foreground">$420 of $300</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <Avatar className="border-2 border-background h-8 w-8">
                              <AvatarImage src="/avatars/02.png" alt="Mike Smith" />
                              <AvatarFallback>MS</AvatarFallback>
                            </Avatar>
                            <Avatar className="border-2 border-background h-8 w-8">
                              <AvatarImage src="/avatars/03.png" alt="Emma Davis" />
                              <AvatarFallback>ED</AvatarFallback>
                            </Avatar>
                          </div>
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="with-you" className="mt-4 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Vacation Fund</h3>
                          <p className="text-sm text-muted-foreground">$850 of $2,000</p>
                          <p className="text-xs text-muted-foreground">Shared by John Doe</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">View Only</Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Household Expenses</h3>
                          <p className="text-sm text-muted-foreground">$1,450 of $2,000</p>
                          <p className="text-xs text-muted-foreground">Shared by Lisa Wong</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Edit Access</Badge>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share a New Budget
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Budget: {selectedBudget}</DialogTitle>
            <DialogDescription>
              Share your budget with family members or roommates to collaborate on financial planning.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <CustomLabel htmlFor="email">Email Address</CustomLabel>
              <div className="flex gap-2">
                <Input id="email" placeholder="name@example.com" className="flex-1" />
                <Button>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <CustomLabel>People with Access</CustomLabel>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>YD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">You (Owner)</p>
                      <p className="text-xs text-muted-foreground">your.email@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="Sarah Johnson" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">sarah@example.com</p>
                    </div>
                  </div>
                  <Select defaultValue="edit">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="remove">Remove</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <CustomLabel>General Access</CustomLabel>
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Anyone with the link</p>
                  <p className="text-xs text-muted-foreground">Share a link that allows viewing the budget</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" className="hidden sm:flex">
              Copy Link
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowShareDialog(false)}>Share</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CustomLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </div>
  )
}

interface BudgetCategoryProps {
  name: string
  spent: number
  budget: number
  icon: React.ReactNode
  overBudget?: boolean
  onShare: () => void
  isShared?: boolean
  sharedWith?: Array<{
    name: string
    email: string
    avatar: string
  }>
}

function BudgetCategory({
  name,
  spent,
  budget,
  icon,
  overBudget = false,
  onShare,
  isShared = false,
  sharedWith = [],
}: BudgetCategoryProps) {
  const percentage = Math.min(Math.round((spent / budget) * 100), 100)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{name}</span>
                {isShared && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Shared
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                ${spent.toFixed(2)} of ${budget.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isShared && sharedWith.length > 0 && (
              <div className="flex -space-x-2 mr-2">
                {sharedWith.map((person, index) => (
                  <Avatar key={index} className="border-2 border-background h-6 w-6">
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onShare}>
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            <div className={`text-sm font-medium ${overBudget ? "text-destructive" : ""}`}>
              {overBudget ? "Over budget" : `${100 - percentage}% left`}
            </div>
          </div>
        </div>
        <Progress
          value={percentage}
          className={overBudget ? "bg-destructive/20" : ""}
          indicatorClassName={overBudget ? "bg-destructive" : ""}
        />
      </CardContent>
    </Card>
  )
}

interface BudgetPlanningItemProps {
  name: string
  amount: number
}

function BudgetPlanningItem({ name, amount }: BudgetPlanningItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 font-medium">{name}</div>
      <div className="relative w-[150px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
        <Input placeholder="0.00" className="pl-7" defaultValue={amount.toFixed(2)} />
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Settings className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </div>
  )
}

