"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Account } from "@/app/types";
import { loadAccounts, updateAccount } from "@/lib/dataSync";
import AccountForm from "@/components/AccountForm";

export default function EditAccountPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccountData();
  }, [accountId]);

  const loadAccountData = async () => {
    const accounts = await loadAccounts();
    const found = accounts.find((acc) => acc._id === accountId || acc.id === accountId);

    if (found) {
      setAccount(found);
    } else {
      alert("Account not found");
      router.push("/accounts");
    }
    setLoading(false);
  };

  const handleSubmit = async (data: Partial<Account>) => {
    const result = await updateAccount(accountId, data);

    if (result) {
      router.push("/accounts?notification=updated");
    } else {
      alert("Failed to update account. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/accounts");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">Loading account...</div>
        </div>
      </div>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <a
            href="/accounts"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm transition-colors"
          >
            ← Back to Accounts
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Account</h1>
          <p className="text-gray-600">Update {account.accountName} details</p>
        </header>

        <AccountForm account={account} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
