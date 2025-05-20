import { Account } from "@/types/account";
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
