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

export interface PeriodicTransaction {
  periodicTransactionId: number;
  frequency: string;
  startDate: string;
  endDate: string;
  transactions: Transaction[];
}

export interface ExtendedRecurringTransaction {
  transaction: Transaction;
  periodic: {
    periodicTransactionId: number;
    frequency: string;
    startDate: string;
    endDate: string;
  };
}
