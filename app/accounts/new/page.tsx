"use client";

import { useRouter } from "next/navigation";
import { Account } from "@/app/types";
import { createAccount } from "@/lib/dataSync";
import AccountForm from "@/components/AccountForm";

export default function NewAccountPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<Account>) => {
    const result = await createAccount(data);

    if (result) {
      // Show success notification and redirect
      router.push("/accounts?notification=created");
    } else {
      alert("Failed to create account. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/accounts");
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Account</h1>
          <p className="text-gray-600">Enter your credit account details</p>
        </header>

        <AccountForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
