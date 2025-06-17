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
import {
  createGoal,
  deleteGoal,
  getGoalsByUserUuid,
  updateGoal,
} from "@/lib/reportsApi";
import { getCurrentUser } from "@/lib/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function GoalsPage() {
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newGoalName, setNewGoalName] = useState("");
  const [newTargetAmount, setNewTargetAmount] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<FinancialGoal | null>(null);
  const [showEditGoalDialog, setShowEditGoalDialog] = useState(false);
  const [editGoalData, setEditGoalData] = useState<FinancialGoal | null>(null);

  const handleEditGoalClick = (goal: FinancialGoal) => {
    setEditGoalData(goal);
    setShowEditGoalDialog(true);
  };

  function calculateGoalStatus(
    currAmount: number,
    targetAmount: number,
    deadline: string
  ): "COMPLETED" | "FAILED" | "ACTIVE" {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (currAmount >= targetAmount) return "COMPLETED";
    if (deadlineDate < now) return "FAILED";
    return "ACTIVE";
  }

  const handleEditGoalSubmit = async () => {
    if (!editGoalData) return;
    try {
      const status = calculateGoalStatus(
        editGoalData.currAmount,
        editGoalData.targetAmount,
        editGoalData.deadline
      );
      console.log("statss ", status);
      await updateGoal(editGoalData.financialGoalId, {
        name: editGoalData.name,
        targetAmount: editGoalData.targetAmount,
        deadline: editGoalData.deadline,
        status: status,
      });
      toast.success("Goal updated successfully!");

      const user = await getCurrentUser();
      if (user) {
        const data = await getGoalsByUserUuid(user.userUuid);
        setGoals(data);
      }

      setShowEditGoalDialog(false);
      setEditGoalData(null);
    } catch (error) {
      toast.error("Failed to update goal");
      console.error(error);
    }
  };

  useEffect(() => {
    const loadGoals = async () => {
      const user = await getCurrentUser();
      if (!user) return console.warn("User not found");
      const data = await getGoalsByUserUuid(user.userUuid);
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

  const activeGoalsCount = activeGoals.length;

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currAmount, 0);

  const now = new Date();
  const upcomingMilestones = activeGoals
    .filter((g) => new Date(g.deadline) > now)
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

  const nextMilestone =
    upcomingMilestones.length > 0 ? upcomingMilestones[0] : null;

  const handleCreateGoal = async () => {
    if (!newGoalName || !newTargetAmount || !newDeadline) {
      return toast.error("Please fill in all fields.");
    }

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not found");

      await createGoal({
        userUuid: user.userUuid,
        name: newGoalName,
        targetAmount: parseFloat(newTargetAmount),
        deadline: newDeadline,
      });

      setShowAddGoalDialog(false);
      setNewGoalName("");
      setNewTargetAmount("");
      setNewDeadline("");

      const data = await getGoalsByUserUuid(user.userUuid);
      setGoals(data);

      toast.success("Goal successfully created!");
    } catch (error) {
      toast.error("Failed to create goal. Please try again.");
      console.error(error);
    }
  };

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;

    try {
      await deleteGoal(goalToDelete.financialGoalId);
      toast.success("Goal deleted successfully");
      const user = await getCurrentUser();
      if (user) {
        const data = await getGoalsByUserUuid(user.userUuid);
        setGoals(data);
      }
    } catch (error) {
      toast.error("Failed to delete goal");
      console.error(error);
    } finally {
      setShowDeleteDialog(false);
      setGoalToDelete(null);
    }
  };

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
              <div className="text-2xl font-bold">{activeGoalsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Saved</CardTitle>
              <CardDescription>Across all goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {totalSaved.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Next Milestone</CardTitle>
              <CardDescription>Coming up soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextMilestone ? nextMilestone.name : "No upcoming milestone"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {nextMilestone
                  ? `$${(
                      nextMilestone.targetAmount - nextMilestone.currAmount
                    ).toLocaleString()} by ${new Date(
                      nextMilestone.deadline
                    ).toLocaleDateString()}`
                  : "Set a deadline to track progress"}
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
                  goal={goal}
                  targetAmount={Number(goal.targetAmount)}
                  currentAmount={Number(goal.currAmount)}
                  deadline={new Date(goal.deadline).toLocaleDateString()}
                  status={goal.status}
                  onDelete={(goal) => {
                    setGoalToDelete(goal);
                    setShowDeleteDialog(true);
                  }}
                  onEdit={(goal) => handleEditGoalClick(goal)}
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
                  goal={goal}
                  onDelete={(goal) => {
                    setGoalToDelete(goal);
                    setShowDeleteDialog(true);
                  }}
                  onEdit={(goal) => handleEditGoalClick(goal)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="failed" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {failedGoals.map((goal) => (
                <FinancialGoalCard
                  key={goal.financialGoalId}
                  goal={goal}
                  name={goal.name}
                  targetAmount={Number(goal.targetAmount)}
                  currentAmount={Number(goal.currAmount)}
                  deadline={new Date(goal.deadline).toLocaleDateString()}
                  status={goal.status}
                  onDelete={(goal) => {
                    setGoalToDelete(goal);
                    setShowDeleteDialog(true);
                  }}
                  onEdit={(goal) => handleEditGoalClick(goal)}
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
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                placeholder="e.g. Emergency Fund"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target-amount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="target-amount"
                    value={newTargetAmount}
                    onChange={(e) => setNewTargetAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddGoalDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
      />*/}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the goal "{goalToDelete?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showEditGoalDialog} onOpenChange={setShowEditGoalDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Make changes to your financial goal and save them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-goal-name">Goal Name</Label>
              <Input
                id="edit-goal-name"
                value={editGoalData?.name || ""}
                onChange={(e) =>
                  setEditGoalData(
                    (prev) => prev && { ...prev, name: e.target.value }
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-target-amount">Target Amount</Label>
              <Input
                id="edit-target-amount"
                type="number"
                value={editGoalData?.targetAmount || ""}
                onChange={(e) =>
                  setEditGoalData(
                    (prev) =>
                      prev && {
                        ...prev,
                        targetAmount: parseFloat(e.target.value),
                      }
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-deadline">Deadline</Label>
              <Input
                id="edit-deadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={editGoalData?.deadline?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditGoalData(
                    (prev) => prev && { ...prev, deadline: e.target.value }
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditGoalDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditGoalSubmit}>Save Changes</Button>
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
  onDelete: (goal: FinancialGoal) => void;
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
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
  onDelete,
  goal,
  onEdit,
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(goal)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(goal)}
            >
              <Trash className="h-4 w-4" />
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
