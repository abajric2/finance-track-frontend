import { Category } from "@/types/category";
import {
  ExtendedRecurringTransaction,
  PeriodicTransaction,
  Transaction,
} from "@/types/transaction";
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

export async function getExtendedRecurringTransactions(
  userId: number
): Promise<ExtendedRecurringTransaction[]> {
  const allTransactions = await getTransactions(userId);
  const recurring = allTransactions.filter(
    (tx) => tx.periodicTransactionId !== null
  );

  const extended = await Promise.all(
    recurring.map(async (tx) => {
      const res = await fetchWithAuth(
        `${TRANSACTION_URL}/periodic/${tx.periodicTransactionId}`
      );

      if (!res.ok) {
        console.warn(
          `Failed to fetch periodic transaction ${tx.periodicTransactionId}`
        );
        return null;
      }

      const periodicData = await res.json();
      console.log("periii ", periodicData);
      return {
        transaction: tx,
        periodic: {
          periodicTransactionId: periodicData.periodicTransactionId,
          frequency: periodicData.frequency,
          startDate: periodicData.startDate,
          endDate: periodicData.endDate,
        },
      };
    })
  );
  console.log("exxxxx", extended);
  return extended.filter(
    (item): item is ExtendedRecurringTransaction => item !== null
  );
}

export async function createPeriodicTransaction(
  periodicTransaction: Partial<PeriodicTransaction>
): Promise<PeriodicTransaction> {
  const payload = {
    ...periodicTransaction,
    transactions: periodicTransaction.transactions ?? [],
  };

  const res = await fetchWithAuth(`${TRANSACTION_URL}/periodic`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create periodic transaction: ${errorText}`);
  }

  return res.json();
}
