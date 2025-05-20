import { Account } from "./account";

export interface UserResponse {
  userId: number;
  userUuid: string;
  dateOfBirth: string;
  country: string;
  currency: string;
  name: string;
  email: string;
  password: string;
  accounts: Account[];
}
