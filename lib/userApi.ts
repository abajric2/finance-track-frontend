import { Account } from "@/types/account";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

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
