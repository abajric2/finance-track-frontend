import { BudgetResponse } from "@/types/budget";
import { fetchWithAuth } from "./fetchWithAuth";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/budgets`;

export async function getBudgetsByUserUuid(userUuid: string): Promise<BudgetResponse[]> {
  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/user/${userUuid}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch budgets for user: ${res.statusText}`);
  }
  return await res.json();
}

export async function incrementCurrentAmount(budgetId: number, amountToAdd: number, currentAmount: number): Promise<BudgetResponse> {
  const updates = {
    currentAmount: amountToAdd + currentAmount,
  };

  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/${budgetId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error(`Failed to update budget: ${res.statusText}`);
  }

  return await res.json();
}
