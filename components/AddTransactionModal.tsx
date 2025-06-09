"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Transaction } from "@/types/transaction";
import { createTransaction, getCategories } from "@/lib/transactionApi";
import { getAccounts, getCurrentUser } from "@/lib/userApi";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { getBudgetsByUserUuid, incrementCurrentAmount } from "@/lib/budgetApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTransactionModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    categoryId: "",
    accountUuid: "",
    budgetUuid: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories);
      getAccounts().then(setAccounts);

      (async () => {
        const user = getCurrentUser();
        if (!user) {
          toast.error("User not found. Please log in again.");
          return;
        }

        try {
          const budgets = await getBudgetsByUserUuid(user.userUuid);
          setBudgets(budgets);
        } catch (err) {
          console.error("Failed to fetch budgets:", err);
          toast.error("Could not load budgets.");
        }
      })();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const selectedBudget = budgets.find(
        (b: any) => b.budgetUuid === formData.budgetUuid
      );

      if (!selectedBudget) {
        toast.error("Selected budget not found.");
        return;
      }

      const amount = parseFloat(formData.amount);

      const transaction: Omit<Transaction, "transactionId"> = {
        transactionUuid: uuidv4(),
        accountUuid: formData.accountUuid as any,
        amount,
        date: formData.date,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        budgetUuid: formData.budgetUuid,
        periodicTransactionId: null,
      };

      await createTransaction(transaction);

      await incrementCurrentAmount(
        selectedBudget.budgetId,
        amount,
        selectedBudget.currentAmount
      );

      toast.success("Transaction added successfully!");

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating transaction:", err);
      toast.error("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="e.g. 100.00"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g. Grocery shopping"
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Category</Label>
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
                    {cat.name} ({cat.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Account</Label>
            <Select
              value={formData.accountUuid}
              onValueChange={(value) =>
                setFormData({ ...formData, accountUuid: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.accountUuid} value={acc.accountUuid}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Budget</Label>
            <Select
              value={formData.budgetUuid}
              onValueChange={(value) =>
                setFormData({ ...formData, budgetUuid: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget.budgetUuid} value={budget.budgetUuid}>
                    {budget.period} – {budget.amount} BAM
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
