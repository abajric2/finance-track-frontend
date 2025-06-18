"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createAccount, getCurrencies, getCurrentUser } from "@/lib/userApi";
import { AccountType } from "@/types/account";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyEntity } from "@/types/currency";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const accountTypes: AccountType[] = [
  "SAVINGS",
  "CHECKING",
  "INVESTMENT",
  "CREDIT",
];

export default function AddAccountModal({ open, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    currencyCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState<CurrencyEntity[]>([]);

  useEffect(() => {
    setFormData({
      name: "",
      type: "",
      balance: "",
      currencyCode: "",
    });
    if (open && currencies.length === 0) {
      getCurrencies()
        .then(setCurrencies)
        .catch((err) => console.error("Error loading currencies:", err));
    }
  }, [open]);

  const handleSubmit = async () => {
    const user = getCurrentUser();
    if (!user?.userId) return;

    try {
      setLoading(true);
      await createAccount({
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        currencyCode: formData.currencyCode,
        userId: user.userId,
      });
      toast.success("Account created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating account:", err);
      toast.error("Failed to create account!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="pointer-events-auto">
          <DialogHeader>
            <DialogTitle>Add Manual Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. My Savings"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as AccountType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Balance</Label>
              <Input
                type="number"
                value={formData.balance}
                onChange={(e) =>
                  setFormData({ ...formData, balance: e.target.value })
                }
                placeholder="e.g. 1000"
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={formData.currencyCode}
                onValueChange={(value) =>
                  setFormData({ ...formData, currencyCode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} – {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </div>{" "}
      </DialogContent>
    </Dialog>
  );
}
