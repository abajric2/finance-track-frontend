import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "react-toastify";
import { CategoryDTO } from "@/types/budgetCategory";
import { updateBudgetDetails } from "@/lib/budgetApi";

export function EditBudgetModal({
  open,
  onClose,
  onSuccess,
  budget,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budget: any;
  categories: CategoryDTO[];
}) {
  const [amount, setAmount] = useState(budget.amount);
  const [period, setPeriod] = useState(budget.period);
  const [endDate, setEndDate] = useState(budget.endDate?.split("T")[0] || "");
  const [categoryId, setCategoryId] = useState(budget.categoryId);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload: any = {
        budgetId: budget.budgetId,
        amount: Number(amount),
        period,
        categoryId,
      };

      if (endDate) {
        payload.endDate = new Date(endDate);
      }

      await updateBudgetDetails(payload);

      toast.success("Budget updated successfully");
      onSuccess();
      onClose();
    } catch (e) {
      toast.error("Failed to update budget");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <label className="text-sm">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm">End Date (optional)</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Category</label>
            <Select
              value={String(categoryId)}
              onValueChange={(val) => setCategoryId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.categoryId}
                    value={String(cat.categoryId)}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
