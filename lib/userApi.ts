import { Account } from "@/types/account";
import { CurrencyEntity } from "@/types/currency";
import { UserResponse } from "@/types/user";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

export async function loginUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Login failed: ${error}`);
  }

  const data: UserResponse | null = await res.json();

  if (!data || !data.userId) {
    throw new Error("Login failed: Invalid user data.");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
}

export async function getAccounts(): Promise<Account[]> {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch accounts: ${res.statusText}`);
  }

  const data: Account[] = await res.json();
  return data;
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

export async function getAccountsByUserId(userId: number): Promise<Account[]> {
  const res = await fetch(`${BASE_URL}/accountsByUserId/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user accounts: ${res.statusText}`);
  }

  const data: Account[] = await res.json();
  return data;
}

export function getCurrentUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export async function createAccount(accountData: {
  name: string;
  type: string;
  balance: number;
  currencyCode: string;
  userId: number;
}): Promise<Account> {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create account: ${error}`);
  }

  const data: Account = await res.json();
  return data;
}

let cachedCurrencies: CurrencyEntity[] | null = null;

export async function getCurrencies(): Promise<CurrencyEntity[]> {
  if (cachedCurrencies) return cachedCurrencies;

  const res = await fetch(`${BASE_URL}/currencies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch currencies: ${res.statusText}`);
  }

  const data: CurrencyEntity[] = await res.json();
  cachedCurrencies = data;
  return data;
}
