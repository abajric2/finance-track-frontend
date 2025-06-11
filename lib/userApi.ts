import { Account } from "@/types/account";
import { CurrencyEntity } from "@/types/currency";
import { UserResponse } from "@/types/user";
import { fetchWithAuth } from "./fetchWithAuth";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Login failed: ${error}`);
  }

  const data: any = await res.json();

  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error("Login failed: Invalid response data.");
  }

  if (typeof window === "undefined") {
    throw new Error("Login must be performed in the browser.");
  }

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data));

  // 🔓 Decode token to extract email
  const base64Url = data.accessToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );

  const decoded = JSON.parse(jsonPayload);
  console.log("ojj ", decoded);

  const userEmail = decoded.sub;

  const userRes = await fetchWithAuth(
    `${BASE_URL}/api/users/email/${userEmail}`
  );

  if (!userRes.ok) {
    throw new Error(`Failed to fetch user by email: ${userRes.statusText}`);
  }

  const user: UserResponse = await userRes.json();

  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

export async function getAccountsByUserId(
  userId: number | null
): Promise<Account[]> {
  const res = await fetchWithAuth(
    `${BASE_URL}/api/users/accountsByUserId/${userId}`
  );
  if (!res.ok)
    throw new Error(`Failed to fetch user accounts: ${res.statusText}`);
  return await res.json();
}

export async function createAccount(accountData: {
  name: string;
  type: string;
  balance: number;
  currencyCode: string;
  userId: number;
}): Promise<Account> {
  const res = await fetchWithAuth(`${BASE_URL}/api/users/accounts`, {
    method: "POST",
    body: JSON.stringify(accountData),
  });
  if (!res.ok) throw new Error(`Failed to create account: ${await res.text()}`);
  return await res.json();
}

export async function updateAccount(account: Account): Promise<void> {
  const res = await fetchWithAuth(
    `${BASE_URL}/api/users/accounts/${account.accountId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: account.name,
        type: account.type,
        balance: account.balance,
        currencyCode: account.currencyCode,
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to update account");
}

export async function deleteAccount(accountId: number): Promise<void> {
  const res = await fetchWithAuth(
    `${BASE_URL}/api/users/accounts/${accountId}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) throw new Error("Failed to delete account");
}

let cachedCurrencies: CurrencyEntity[] | null = null;

export async function getCurrencies(): Promise<CurrencyEntity[]> {
  if (cachedCurrencies) return cachedCurrencies;
  const res = await fetchWithAuth(`${BASE_URL}/api/users/currencies`);
  if (!res.ok) throw new Error(`Failed to fetch currencies: ${res.statusText}`);
  const data = await res.json();
  cachedCurrencies = data;
  return data;
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export function getCurrentUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  dateOfBirth: string;
  country: string;
  currency?: string;
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      role: data.role ?? "FREE",
      currency: data.currency ?? "USD",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Registration failed: ${error}`);
  }
}
