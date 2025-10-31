import { Account } from "@/app/types";

/**
 * Migrate accounts from localStorage to MongoDB
 */
export async function migrateToMongoDB(): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    // Load accounts from localStorage
    const stored = localStorage.getItem("accounts");
    if (!stored) {
      return { success: false, error: "No accounts found in localStorage" };
    }

    const accounts: Account[] = JSON.parse(stored);
    if (accounts.length === 0) {
      return { success: false, error: "No accounts to migrate" };
    }

    // Call migration API
    const response = await fetch("/api/accounts/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts }),
    });

    if (!response.ok) {
      throw new Error("Migration failed");
    }

    const result = await response.json();
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error migrating accounts:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
