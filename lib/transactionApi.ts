import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { fetchWithAuth } from "./fetchWithAuth";
import { getAccountsByUserId } from "./userApi";

const TRANSACTION_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions/api/transactions`;

export async function getTransactions(userId: number): Promise<Transaction[]> {
  const accounts = await getAccountsByUserId(userId);

  const allTransactions: Transaction[] = [];

  await Promise.all(
    accounts.map(async (account) => {
      const res = await fetchWithAuth(
        `${TRANSACTION_URL}/account/${account.accountUuid}`
      );
      if (!res.ok) {
        console.warn(
          `Failed to fetch transactions for account ${account.accountUuid}`
        );
        return;
      }
      const transactions: Transaction[] = await res.json();
      allTransactions.push(...transactions);
    })
  );

  return allTransactions;
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
