export interface BudgetResponse {
  budgetId: number;
  budgetUuid: string;
  owner: string;
  shared: boolean;
  amount: number;
  currentAmount: number;
  period: string;
  startDate: string;
  endDate: string;
  categoryId: number;
}

export interface BudgetUserDTO {
  id: number;
  budgetId: number;
  userUuid: string;
}
