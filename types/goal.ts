export interface FinancialGoal {
  financialGoalId: number;
  userUuid: string;
  name: string;
  targetAmount: number;
  currAmount: number;
  deadline: string;
  status: "ACTIVE" | "COMPLETED" | "FAILED";
  transactions: any[];
}
