import { FinancialGoal } from "@/types/goal"
import { getCurrentUser } from "./userApi"
import { fetchWithAuth } from "./fetchWithAuth"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/api/reports`;

export async function getGoalsByUserUuid(userUuid: string): Promise<FinancialGoal[]> {
  console.log("lavv ", localStorage.getItem("accessToken"))
  const res = await fetchWithAuth(`${BASE_URL}/goals/user/${userUuid}`)
  if (!res.ok) throw new Error("Failed to fetch financial goals")
  return res.json()
}
