"use client";

import { useState, useEffect } from "react";

// Account type definition
interface Account {
  id: string;
  accountName: string;
  accountNumber?: string;
  creditLimit: number;
  amountOwed?: number;
  minimumMonthlyPayment?: number;
  interestRate?: number;
  rateExpiration?: string;
  rewards?: number;
  lastUsed?: number;
  position: number;
}

// Utility functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/*
const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
*/

// Form component for adding/editing accounts
function AccountForm({
  account,
  onSubmit,
  onCancel,
}: {
  account?: Account;
  onSubmit: (data: Partial<Account>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    accountName: account?.accountName || "",
    accountNumber: account?.accountNumber || "",
    creditLimit: account?.creditLimit || 0,
    amountOwed: account?.amountOwed || 0,
    minimumMonthlyPayment: account?.minimumMonthlyPayment || 0,
    interestRate: account?.interestRate || 0,
    rateExpiration: account?.rateExpiration || "",
    rewards: account?.rewards || 0,
    lastUsed: account?.lastUsed || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "lastUsed") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      lastUsed:
        formData.lastUsed === "" ? undefined : Number(formData.lastUsed),
    };
    onSubmit(submittedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-4 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="accountName"
        >
          Account Name *
        </label>
        <input
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="accountName"
          type="text"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="accountNumber"
        >
          Account Number
        </label>
        <input
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="accountNumber"
          type="text"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="creditLimit"
        >
          Credit Limit *
        </label>
        <input
          name="creditLimit"
          value={
            formData.creditLimit === 0 && !account ? "" : formData.creditLimit
          }
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="creditLimit"
          type="number"
          step="0.01"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amountOwed"
        >
          Amount Owed
        </label>
        <input
          name="amountOwed"
          value={formData.amountOwed === 0 ? "" : formData.amountOwed}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amountOwed"
          type="number"
          step="0.01"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="minimumMonthlyPayment"
        >
          Minimum Monthly Payment
        </label>
        <input
          name="minimumMonthlyPayment"
          value={
            formData.minimumMonthlyPayment === 0
              ? ""
              : formData.minimumMonthlyPayment
          }
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="minimumMonthlyPayment"
          type="number"
          step="0.01"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="interestRate"
        >
          Interest Rate (%)
        </label>
        <input
          name="interestRate"
          value={formData.interestRate === 0 ? "" : formData.interestRate}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="interestRate"
          type="number"
          step="0.01"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="rateExpiration"
        >
          Rate Expiration
        </label>
        <input
          name="rateExpiration"
          value={formData.rateExpiration}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="rateExpiration"
          type="date"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="rewards"
        >
          Rewards
        </label>
        <input
          name="rewards"
          value={formData.rewards === 0 ? "" : formData.rewards}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="rewards"
          type="number"
          step="0.01"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="lastUsed"
        >
          Last Used (1-12)
        </label>
        <input
          name="lastUsed"
          value={formData.lastUsed || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="lastUsed"
          type="number"
          min="1"
          max="12"
          step="1"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {account ? "Update Account" : "Add Account"}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Table component for displaying accounts
function AccountTable({
  accounts,
  onEdit,
  onDelete,
  onMove,
  onMakePayment,
}: {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onMakePayment: (id: string, amount: number) => void;
}) {
  // Sort state
  const [sortField, setSortField] = useState<
    keyof Account | "amountAvailable" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort accounts
  const sortedAccounts = [...accounts].sort((a, b) => {
    if (!sortField) return a.position - b.position;

    if (sortField === "amountAvailable") {
      const aValue = (a.creditLimit || 0) - (a.amountOwed || 0);
      const bValue = (b.creditLimit || 0) - (b.amountOwed || 0);
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    const aValue = a[sortField] || 0;
    const bValue = b[sortField] || 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Handle sort
  const handleSort = (field: keyof Account | "amountAvailable") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate summary totals
  const summaryTotals = sortedAccounts.reduce(
    (totals, account) => {
      const amountAvailable =
        (account.creditLimit || 0) - (account.amountOwed || 0);

      return {
        creditLimit: totals.creditLimit + (account.creditLimit || 0),
        amountOwed: totals.amountOwed + (account.amountOwed || 0),
        amountAvailable: totals.amountAvailable + amountAvailable,
        minimumMonthlyPayment:
          totals.minimumMonthlyPayment + (account.minimumMonthlyPayment || 0),
      };
    },
    {
      creditLimit: 0,
      amountOwed: 0,
      amountAvailable: 0,
      minimumMonthlyPayment: 0,
    }
  );

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    // Create CSV content
    const headers = [
      "Account Name",
      "Account Number",
      "Credit Limit",
      "Amount Owed",
      "Amount Available",
      "Minimum Monthly Payment",
      "Interest Rate",
      "Rate Expiration",
      "Rewards",
      "Last Used",
    ].join(",");

    const rows = accounts.map((account) => {
      const amountAvailable =
        (account.creditLimit || 0) - (account.amountOwed || 0);
      return [
        `"${account.accountName}"`,
        `"${account.accountNumber || ""}"`,
        account.creditLimit,
        account.amountOwed || 0,
        amountAvailable,
        account.minimumMonthlyPayment || 0,
        account.interestRate || 0,
        account.rateExpiration || "",
        account.rewards || 0,
        account.lastUsed || "",
      ].join(",");
    });

    const csvContent = [headers, ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "accounts.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={handlePrint}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Print
        </button>
        <button
          onClick={handleExportCSV}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Download CSV
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border no-print">Actions</th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("accountName")}
            >
              Account Name{" "}
              {sortField === "accountName" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("accountNumber")}
            >
              Account Number{" "}
              {sortField === "accountNumber" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("creditLimit")}
            >
              Credit Limit{" "}
              {sortField === "creditLimit" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("amountOwed")}
            >
              Amount Owed{" "}
              {sortField === "amountOwed" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("amountAvailable")}
            >
              Amount Available{" "}
              {sortField === "amountAvailable" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("minimumMonthlyPayment")}
            >
              Minimum Payment{" "}
              {sortField === "minimumMonthlyPayment" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("interestRate")}
            >
              Interest Rate{" "}
              {sortField === "interestRate" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-4 border">Percent Utilization</th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("rateExpiration")}
            >
              Rate Expiration{" "}
              {sortField === "rateExpiration" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("rewards")}
            >
              Rewards{" "}
              {sortField === "rewards" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
              onClick={() => handleSort("lastUsed")}
            >
              Last Used{" "}
              {sortField === "lastUsed" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.map((account,index) => {
            const amountAvailable =
              (account.creditLimit || 0) - (account.amountOwed || 0);

            return (
              <tr key={"accountRow" + index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border no-print">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onMove(account.id, "up")}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={account.position === 0}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => onMove(account.id, "down")}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={account.position === accounts.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => onEdit(account)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(account.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        const amount = parseFloat(
                          prompt("Payment Amount:") || "0"
                        );
                        if (amount > 0) onMakePayment(account.id, amount);
                      }}
                      className="text-green-500 hover:text-green-700"
                      disabled={!account.amountOwed || account.amountOwed <= 0}
                    >
                      Pay
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border">{account.accountName}</td>
                <td className="py-2 px-4 border">{account.accountNumber}</td>
                <td className="py-2 px-4 border">
                  {formatCurrency(account.creditLimit)}
                </td>
                <td className="py-2 px-4 border">
                  {formatCurrency(account.amountOwed || 0)}
                </td>
                <td className="py-2 px-4 border">
                  {formatCurrency(amountAvailable)}
                </td>
                <td className="py-2 px-4 border">
                  {formatCurrency(account.minimumMonthlyPayment || 0)}
                </td>
                <td className="py-2 px-4 border">
                  {account.interestRate ? `${account.interestRate}%` : "-"}
                </td>
                <td className="py-2 px-4 border">
                  {account.creditLimit > 0
                    ? `${Math.round(
                        ((account.amountOwed || 0) / account.creditLimit) * 100
                      )}%`
                    : "-"}
                </td>
                <td className="py-2 px-4 border">
                  {account.rateExpiration || "-"}
                </td>
                <td className="py-2 px-4 border">
                  {account.rewards ? formatCurrency(account.rewards) : "-"}
                </td>
                <td className="py-2 px-4 border">{account.lastUsed || "-"}</td>
              </tr>
            );
          })}

          {/* Summary row */}
          <tr key="summary-row" className="bg-gray-200 font-bold">
            <td colSpan={3} className="py-2 px-4 border text-right no-print">
              Totals:
            </td>
            <td
              colSpan={2}
              className="py-2 px-4 border text-right print-only"
              style={{ display: "none" }}
            >
              Totals:
            </td>
            <td className="py-2 px-4 border">
              {formatCurrency(summaryTotals.creditLimit)}
            </td>
            <td className="py-2 px-4 border">
              {formatCurrency(summaryTotals.amountOwed)}
            </td>
            <td className="py-2 px-4 border">
              {formatCurrency(summaryTotals.amountAvailable)}
            </td>
            <td className="py-2 px-4 border">
              {formatCurrency(summaryTotals.minimumMonthlyPayment)}
            </td>
            <td className="py-2 px-4 border"></td>
            <td className="py-2 px-4 border">
              {Math.round(
                (summaryTotals.amountOwed / summaryTotals.creditLimit) * 100
              )}
              %
            </td>
            <td colSpan={2} className="py-2 px-4 border"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

const fetchAccounts = async () => {
  try {
    const response = await fetch('/api/accounts');
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
};


  const saveAccounts = async (updatedAccounts: Account[]) => {
    try {
      // In a real app, this would be a fetch call to your API
      localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    } catch (error) {
      console.error("Error saving accounts:", error);
    }
  };

  // Load accounts on initial render
  useEffect(() => {
    const loadAccounts = async () => {
      const data = await fetchAccounts();
      setAccounts(data);
    };

    loadAccounts();
  }, []);
  // In your page.tsx
  const migrateToMongoDB = async () => {
    try {
      // Get data from localStorage
      const storedAccounts = localStorage.getItem("accounts");
      if (!storedAccounts) {
        alert("No accounts found in localStorage");
        return;
      }

      const accounts = JSON.parse(storedAccounts);

      // Send to MongoDB via API
      const response = await fetch("/api/accounts/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accounts }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Migration successful! " + result.count + " accounts migrated.");
      } else {
        alert("Migration failed: " + result.error);
      }
    } catch (error) {
      console.error("Migration error:", error);
      alert("Migration failed. See console for details.");
    }
  };

  // Handle adding a new account
  const handleAddAccount = async (accountData: Partial<Account>) => {
    const newAccount: Account = {
      ...(accountData as Omit<Account, "id" | "position">),
      id: Date.now().toString(), // Generate a unique ID
      position: accounts.length, // Add at the end
    };

    const updatedAccounts = [...accounts, newAccount];
    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
    setIsFormVisible(false);
  };

  // Handle updating an existing account
  const handleUpdateAccount = async (accountData: Partial<Account>) => {
    if (!editingAccount) return;

    const updatedAccount = {
      ...editingAccount,
      ...accountData,
    };

    const updatedAccounts = accounts.map((account) =>
      account.id === editingAccount.id ? updatedAccount : account
    );

    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
    setEditingAccount(null);
  };

  // Handle deleting an account
  const handleDeleteAccount = async (id: string) => {
    const updatedAccounts = accounts
      .filter((account) => account.id !== id)
      .map((account, index) => ({ ...account, position: index }));

    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
  };

  // Handle moving an account up or down
  const handleMoveAccount = async (id: string, direction: "up" | "down") => {
    const currentIndex = accounts.findIndex((account) => account.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === accounts.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newAccounts = [...accounts];
    const [movedAccount] = newAccounts.splice(currentIndex, 1);
    newAccounts.splice(newIndex, 0, movedAccount);

    // Update positions
    const updatedAccounts = newAccounts.map((account, index) => ({
      ...account,
      position: index,
    }));

    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
  };

  // Handle making a payment on an account
  const handleMakePayment = async (id: string, amount: number) => {
    const updatedAccounts = accounts.map((account) => {
      if (account.id === id) {
        const currentAmountOwed = account.amountOwed || 0;
        const newAmountOwed = Math.max(0, currentAmountOwed - amount);

        return {
          ...account,
          amountOwed: newAmountOwed,
        };
      }
      return account;
    });

    await saveAccounts(updatedAccounts);
    setAccounts(updatedAccounts);
  };

  // Handle form submission
  const handleFormSubmit = (data: Partial<Account>) => {
    if (editingAccount) {
      handleUpdateAccount(data);
    } else {
      handleAddAccount(data);
    }
  };

  // Handle edit button click
  const handleEditClick = (account: Account) => {
    setEditingAccount(account);
    setIsFormVisible(true);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setEditingAccount(null);
    setIsFormVisible(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Financial Account Manager
      </h1>

      {!isFormVisible ? (
        <div className="mb-6 flex justify-between">
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add New Account
          </button>

          <button
            onClick={migrateToMongoDB}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Migrate to MongoDB
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAccount ? "Edit Account" : "Add New Account"}
          </h2>
          <AccountForm
            account={editingAccount || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-gray-500">
            No accounts added yet. Add your first account above.
          </p>
        ) : (
          <AccountTable
            accounts={accounts}
            onEdit={handleEditClick}
            onDelete={handleDeleteAccount}
            onMove={handleMoveAccount}
            onMakePayment={handleMakePayment}
          />
        )}
      </div>
    </div>
  );
}
