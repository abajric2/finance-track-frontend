import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { fetchWithAuth } from "./fetchWithAuth";

const TRANSACTION_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/api/transactions`;

export async function getTransactions(): Promise<Transaction[]> {
  const res = await fetchWithAuth(`${TRANSACTION_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch transactions: ${res.statusText}`);
  }

  const data: Transaction[] = await res.json();
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetchWithAuth(`${TRANSACTION_URL}/categories`);
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export async function createTransaction(transaction: Partial<Transaction>) {
  const res = await fetchWithAuth(`${TRANSACTION_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    throw new Error(`Failed to create transaction: ${res.statusText}`);
  }

  return res.json();
}
