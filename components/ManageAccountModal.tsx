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
import { Account, AccountType } from "@/types/account";
import { getCurrencies, updateAccount, deleteAccount } from "@/lib/userApi";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  account: Account;
  onSuccess: () => void;
}

export default function ManageAccountModal({
  open,
  onClose,
  account,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<Account>(account);
  const [currencies, setCurrencies] = useState<
    { code: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      ...account,
      currencyCode: account.currencyCode || account.currencyEntity?.code || "",
    });
  }, [account]);

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateAccount(form);
      toast.success("Account updated successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(
        error?.message || "An error occurred while updating the account."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount(form.accountId);
      toast.success("Account deleted successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(
        error?.message || "An error occurred while deleting the account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(val) =>
                setForm({ ...form, type: val as AccountType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {["SAVINGS", "CHECKING", "INVESTMENT", "CREDIT"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Balance</Label>
            <Input
              type="number"
              value={form.balance}
              onChange={(e) =>
                setForm({ ...form, balance: parseFloat(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Select
              value={form.currencyCode}
              onValueChange={(val) => setForm({ ...form, currencyCode: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
