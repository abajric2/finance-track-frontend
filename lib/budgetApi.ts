import { BudgetResponse, BudgetUserDTO } from "@/types/budget";
import { fetchWithAuth } from "./fetchWithAuth";
import { CategoryDTO } from "@/types/budgetCategory";
import { UserResponse } from "@/types/user";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/budgets`;

export async function getBudgetsByUserUuid(
  userUuid: string
): Promise<BudgetResponse[]> {
  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/user/${userUuid}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch budgets for user: ${res.statusText}`);
  }
  return await res.json();
}

export async function incrementCurrentAmount(
  budgetId: number,
  amountToAdd: number,
  currentAmount: number
): Promise<BudgetResponse> {
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

export async function getAllCategories(): Promise<CategoryDTO[]> {
  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/categories`);
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }
  return await res.json();
}

export async function createCategory(data: {
  name: string;
  type: string;
}): Promise<CategoryDTO> {
  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create category: ${res.statusText}`);
  }

  return await res.json();
}

export async function createBudget(data: {
  owner: string; // UUID
  amount: number;
  period: string;
  categoryId: number;
  startDate?: Date;
  endDate?: Date | null;
}): Promise<BudgetResponse> {
  const now = new Date();

  const budgetPayload = {
    owner: data.owner,
    amount: data.amount,
    currentAmount: 0,
    shared: false,
    period: data.period,
    startDate: (data.startDate ?? now).toISOString(),
    endDate: data.endDate ? data.endDate.toISOString() : null,
    categoryId: data.categoryId,
    budgetUsers: [],
  };

  const budgetRes = await fetchWithAuth(`${BASE_URL}/api/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budgetPayload),
  });

  if (!budgetRes.ok) {
    throw new Error(`Failed to create budget: ${budgetRes.statusText}`);
  }

  const createdBudget: BudgetResponse = await budgetRes.json();

  const userRes = await fetchWithAuth(
    `${BASE_URL}/api/budgets/${createdBudget.budgetId}/users?userUuid=${data.owner}`,
    {
      method: "POST",
    }
  );

  if (!userRes.ok) {
    throw new Error(`Failed to assign user to budget: ${userRes.statusText}`);
  }

  return createdBudget;
}

export async function getUsersByBudgetId(
  budgetId: number
): Promise<BudgetUserDTO[]> {
  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/${budgetId}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function addUserToBudget(
  budgetId: number,
  userUuid: string
): Promise<BudgetUserDTO> {
  const res = await fetchWithAuth(
    `${BASE_URL}/api/budgets/${budgetId}/users?userUuid=${userUuid}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `Failed to add user to budget (${budgetId}): ${res.status} - ${message}`
    );
  }

  return res.json();
}

export async function markBudgetAsShared(
  budgetId: number
): Promise<BudgetResponse> {
  const updates = { shared: true };

  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/${budgetId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `Failed to mark budget as shared: ${res.status} - ${message}`
    );
  }

  return await res.json();
}

export async function updateBudgetDetails(data: {
  budgetId: number;
  amount: number;
  period: string;
  endDate?: Date | null;
  categoryId: number;
}): Promise<BudgetResponse> {
  const updates: Record<string, any> = {
    amount: data.amount,
    period: data.period,
    categoryId: data.categoryId,
  };

  if (data.endDate) {
    updates.endDate = data.endDate.getTime();
  }

  const res = await fetchWithAuth(`${BASE_URL}/api/budgets/${data.budgetId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `Failed to update budget details: ${res.status} - ${message}`
    );
  }

  return await res.json();
}
