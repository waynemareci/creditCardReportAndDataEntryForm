import { Account } from '@/app/types';

const STORAGE_KEY = 'accounts';

/**
 * Save accounts to localStorage
 */
export function saveToLocalStorage(accounts: Account[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load accounts from localStorage
 */
export function loadFromLocalStorage(): Account[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
}

/**
 * Clear localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Fetch all accounts from MongoDB API
 */
export async function fetchAccountsFromMongoDB(): Promise<Account[]> {
  try {
    const response = await fetch('/api/accounts');
    if (!response.ok) {
      throw new Error(`Failed to fetch accounts: ${response.statusText}`);
    }
    const data = await response.json();

    // Normalize MongoDB _id to id for frontend
    return data.map((account: any) => ({
      ...account,
      id: account._id || account.id,
    }));
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    return [];
  }
}

/**
 * Create a new account in MongoDB
 */
export async function createAccountInMongoDB(accountData: Partial<Account>): Promise<Account | null> {
  try {
    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create account: ${response.statusText}`);
    }

    const account = await response.json();
    return {
      ...account,
      id: account._id || account.id,
    };
  } catch (error) {
    console.error('Error creating account in MongoDB:', error);
    return null;
  }
}

/**
 * Update an account in MongoDB
 */
export async function updateAccountInMongoDB(
  id: string,
  accountData: Partial<Account>
): Promise<Account | null> {
  try {
    const response = await fetch(`/api/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update account: ${response.statusText}`);
    }

    const account = await response.json();
    return {
      ...account,
      id: account._id || account.id,
    };
  } catch (error) {
    console.error('Error updating account in MongoDB:', error);
    return null;
  }
}

/**
 * Delete an account from MongoDB
 */
export async function deleteAccountFromMongoDB(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/accounts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting account from MongoDB:', error);
    return false;
  }
}

/**
 * Load accounts with fallback strategy:
 * 1. Try MongoDB first
 * 2. If fails, load from localStorage
 * 3. Sync to localStorage after successful MongoDB load
 */
export async function loadAccounts(): Promise<Account[]> {
  // Try MongoDB first
  const mongoAccounts = await fetchAccountsFromMongoDB();

  if (mongoAccounts.length > 0) {
    // Success! Cache in localStorage
    saveToLocalStorage(mongoAccounts);
    return mongoAccounts;
  }

  // MongoDB failed or empty, try localStorage
  const localAccounts = loadFromLocalStorage();

  if (localAccounts.length > 0) {
    console.warn('Using localStorage fallback - MongoDB unavailable');
    return localAccounts;
  }

  // Both empty
  return [];
}

/**
 * Create account with sync
 */
export async function createAccount(accountData: Partial<Account>): Promise<Account | null> {
  // Create in MongoDB
  const mongoAccount = await createAccountInMongoDB(accountData);

  if (mongoAccount) {
    // Success! Update localStorage cache
    const allAccounts = await fetchAccountsFromMongoDB();
    saveToLocalStorage(allAccounts);
    return mongoAccount;
  }

  // MongoDB failed, could add localStorage-only fallback here if needed
  return null;
}

/**
 * Update account with sync
 */
export async function updateAccount(
  id: string,
  accountData: Partial<Account>
): Promise<Account | null> {
  // Update in MongoDB
  const mongoAccount = await updateAccountInMongoDB(id, accountData);

  if (mongoAccount) {
    // Success! Update localStorage cache
    const allAccounts = await fetchAccountsFromMongoDB();
    saveToLocalStorage(allAccounts);
    return mongoAccount;
  }

  return null;
}

/**
 * Delete account with sync
 */
export async function deleteAccount(id: string): Promise<boolean> {
  // Delete from MongoDB
  const success = await deleteAccountFromMongoDB(id);

  if (success) {
    // Success! Update localStorage cache
    const allAccounts = await fetchAccountsFromMongoDB();
    saveToLocalStorage(allAccounts);
    return true;
  }

  return false;
}

/**
 * Make a payment on an account (reduces amountOwed)
 */
export async function makePayment(id: string, paymentAmount: number): Promise<Account | null> {
  try {
    // Fetch current account to get current amountOwed
    const response = await fetch('/api/accounts');
    if (!response.ok) throw new Error('Failed to fetch accounts');

    const accounts: Account[] = await response.json();
    const account = accounts.find((acc: any) => acc._id === id || acc.id === id);

    if (!account) {
      throw new Error('Account not found');
    }

    const currentOwed = account.amountOwed || 0;
    const newAmountOwed = Math.max(0, currentOwed - paymentAmount);

    // Update the account
    return await updateAccount(id, { amountOwed: newAmountOwed });
  } catch (error) {
    console.error('Error making payment:', error);
    return null;
  }
}
