import { CurrencyEntity } from "./currency";

export type AccountType = "SAVINGS" | "CHECKING" | "INVESTMENT" | "CREDIT";

export interface Account {
  accountId: number;
  accountUuid: string;
  name: string;
  type: AccountType;
  balance: number;
  currencyCode: string;
  userId: number;
  currencyEntity?: CurrencyEntity;
}
