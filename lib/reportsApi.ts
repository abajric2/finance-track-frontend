import { FinancialGoal } from "@/types/goal";
import { getCurrentUser } from "./userApi";
import { fetchWithAuth } from "./fetchWithAuth";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/api/reports`;

export async function getGoalsByUserUuid(
  userUuid: string
): Promise<FinancialGoal[]> {
  console.log("lavv ", localStorage.getItem("accessToken"));
  const res = await fetchWithAuth(`${BASE_URL}/goals/user/${userUuid}`);
  if (!res.ok) throw new Error("Failed to fetch financial goals");
  return res.json();
}

export async function createGoal(goal: {
  userUuid: string;
  name: string;
  targetAmount: number;
  deadline: string;
}): Promise<FinancialGoal> {
  const res = await fetchWithAuth(`${BASE_URL}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userUuid: goal.userUuid,
      name: goal.name,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline,
      currAmount: 0,
      status: "ACTIVE",
    }),
  });

  if (!res.ok) throw new Error("Failed to create financial goal");
  return res.json();
}

export async function updateGoal(
  id: number,
  updates: Partial<Pick<FinancialGoal, "name" | "targetAmount" | "deadline">>
): Promise<FinancialGoal> {
  const res = await fetchWithAuth(`${BASE_URL}/goals/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update financial goal");
  return res.json();
}

export async function deleteGoal(id: number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/goals/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete financial goal");
}
