"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Edit,
  Filter,
  Plus,
  Search,
  Target,
  Trash,
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FinancialGoal } from "@/types/goal";
import { getGoalsByUserUuid } from "@/lib/reportsApi";
import { getCurrentUser } from "@/lib/userApi";

export default function GoalsPage() {
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadGoals = async () => {
      console.log("ojjj");
      const user = await getCurrentUser();
      if (!user) return console.warn("User not found");
      console.log("lavvoi ", user);
      const data = await getGoalsByUserUuid(user.userUuid);
      console.log("<golzzz ", data);
      setGoals(data);
    };

    loadGoals();
  }, []);

  const filteredGoals = goals.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeGoals = filteredGoals.filter((g) => g.status === "ACTIVE");
  const completedGoals = filteredGoals.filter((g) => g.status === "COMPLETED");
  const failedGoals = filteredGoals.filter((g) => g.status === "FAILED");

  return (
    <div className="container py-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Financial Goals
            </h1>
            <p className="text-muted-foreground">
              Set, track, and achieve your financial goals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAddGoalDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Goal
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Goals</CardTitle>
              <CardDescription>Currently tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-2">
                2 goals on track, 3 need attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Saved</CardTitle>
              <CardDescription>Across all goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground mt-2">
                +$1,250 this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Next Milestone</CardTitle>
              <CardDescription>Coming up soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Emergency Fund</div>
              <p className="text-xs text-muted-foreground mt-2">
                $8,000 by August 15, 2023
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="active" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {activeGoals.map((goal) => (
                <FinancialGoalCard
                  key={goal.financialGoalId}
                  name={goal.name}
                  targetAmount={Number(goal.targetAmount)}
                  currentAmount={Number(goal.currAmount)}
                  deadline={new Date(goal.deadline).toLocaleDateString()}
                  status={goal.status}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {completedGoals.map((goal) => (
                <FinancialGoalCard
                  key={goal.financialGoalId}
                  name={goal.name}
                  targetAmount={Number(goal.targetAmount)}
                  currentAmount={Number(goal.currAmount)}
                  deadline={new Date(goal.deadline).toLocaleDateString()}
                  status={goal.status}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="failed" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {failedGoals.map((goal) => (
                <FinancialGoalCard
                  key={goal.financialGoalId}
                  name={goal.name}
                  targetAmount={Number(goal.targetAmount)}
                  currentAmount={Number(goal.currAmount)}
                  deadline={new Date(goal.deadline).toLocaleDateString()}
                  status={goal.status}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Financial Goal</DialogTitle>
            <DialogDescription>
              Set a new financial goal to track your progress and stay
              motivated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input
                id="goal-name"
                placeholder="e.g. Emergency Fund, New Car, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target-amount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="target-amount"
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current-amount">Current Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="current-amount"
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input id="deadline" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select>
                  <SelectTrigger id="timeframe">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">
                      Short Term (&lt; 1 year)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium Term (1-5 years)
                    </SelectItem>
                    <SelectItem value="long">
                      Long Term (&gt; 5 years)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details about your goal..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddGoalDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowAddGoalDialog(false)}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface FinancialGoalProps {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
  priority?: "High" | "Medium" | "Low";
  timeframe?: string;
  status: "ACTIVE" | "COMPLETED" | "FAILED";
}

function FinancialGoalCard({
  name,
  targetAmount,
  currentAmount,
  deadline,
  // category,
  //priority,
  //timeframe,
  status,
}: FinancialGoalProps) {
  const progress = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100
  );
  /* const priorityColor =
    priority === "High"
      ? "text-red-500"
      : priority === "Medium"
      ? "text-amber-500"
      : "text-green-500";*/

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {name}
              {status === "COMPLETED" && (
                <Badge className="bg-green-500 text-white">
                  <Check className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}

              {status === "FAILED" && (
                <Badge className="bg-red-500 text-white">Failed</Badge>
              )}
            </CardTitle>
            {/*/ <CardDescription>{category}</CardDescription>*/}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-xl font-bold">
              ${currentAmount.toLocaleString()} of $
              {targetAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-2xl font-bold">{progress}%</div>
        </div>
        <Progress
          value={progress}
          indicatorColor={
            status === "COMPLETED"
              ? "bg-green-500"
              : status === "FAILED"
              ? "bg-red-500"
              : undefined
          }
        />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Deadline
            </p>
            <p>{deadline}</p>
          </div>
          {status === "ACTIVE" && (
            <Button size="sm" className="w-36 ml-auto">
              <ArrowRight className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          )}
          {/*<div>
            <p className="text-muted-foreground flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Priority
            </p>
            <p className={priorityColor}>{priority}</p>
          </div>*/}
        </div>
        <div className="flex justify-between items-center">
          {/*<Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeframe}
          </Badge>*/}
        </div>
      </CardContent>
    </Card>
  );
}
