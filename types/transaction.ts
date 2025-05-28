export interface Transaction {
  transactionId: number;
  transactionUuid: string;
  accountUuid: string;
  amount: number;
  date: string;
  description: string;
  budgetUuid: string;
  categoryId: number;
  periodicTransactionId: number | null;
}

export interface TransactionFormValues {
  amount: string;
  date: string;
  description: string;
  accountUuid: string;
  categoryId: string;
}
