import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "react-toastify";
import { CategoryDTO } from "@/types/budgetCategory";
import { getCategories } from "@/lib/transactionApi";
import { createCategory } from "@/lib/budgetApi";
import { Category } from "@/types/category";

interface ManageCategoriesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function ManageCategoriesModal({
  open,
  onClose,
  onSuccess,
}: ManageCategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ name: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  async function fetchCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleCreateCategory() {
    setLoading(true);
    try {
      await createCategory(formData);
      toast.success("Category created!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleCreateCategory} disabled={loading}>
          {loading ? "Saving..." : "Create Category"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ManageCategoriesModal;
