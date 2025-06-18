"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createBudget, getAllCategories } from "@/lib/budgetApi";
import { CategoryDTO } from "@/types/budgetCategory";
import { getCurrentUser } from "@/lib/userApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBudgetModal({ open, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    amount: "",
    period: "monthly",
    categoryId: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  useEffect(() => {
    setFormData({
      amount: "",
      period: "",
      categoryId: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
    });
    if (open) {
      getAllCategories().then(setCategories);
    }
  }, [open]);

  const handleSubmit = async () => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const { amount, period, categoryId, startDate, endDate } = formData;
    if (!amount || !categoryId || !period) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await createBudget({
        owner: user.userUuid,
        amount: parseFloat(amount),
        period,
        categoryId: parseInt(categoryId),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      });

      toast.success("Budget created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>
              Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="e.g. 1000"
            />
          </div>

          <div>
            <Label>
              Period <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.period}
              onValueChange={(value) =>
                setFormData({ ...formData, period: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
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

          <div>
            <Label>Start Date (optional)</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <Label>End Date (optional)</Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
