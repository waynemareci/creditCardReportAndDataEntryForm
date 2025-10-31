import { Account } from "@/app/types";

/**
 * Reorder accounts by moving one account up or down
 */
export async function reorderAccount(
  accountId: string,
  direction: "up" | "down"
): Promise<Account[] | null> {
  try {
    const response = await fetch("/api/accounts/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, direction }),
    });

    if (!response.ok) {
      throw new Error("Failed to reorder account");
    }

    const accounts = await response.json();
    return accounts.map((acc: any) => ({
      ...acc,
      id: acc._id || acc.id,
    }));
  } catch (error) {
    console.error("Error reordering account:", error);
    return null;
  }
}
