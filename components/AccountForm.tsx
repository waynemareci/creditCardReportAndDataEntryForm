"use client";

import { useState, useEffect } from "react";
import { Account } from "@/app/types";

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: Partial<Account>) => Promise<void>;
  onCancel: () => void;
}

export default function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState({
    accountName: account?.accountName || "",
    accountNumber: account?.accountNumber || "",
    creditLimit: account?.creditLimit?.toString() || "",
    amountOwed: account?.amountOwed?.toString() || "",
    minimumMonthlyPayment: account?.minimumMonthlyPayment?.toString() || "",
    interestRate: account?.interestRate?.toString() || "",
    rateExpiration: account?.rateExpiration || "",
    rewards: account?.rewards?.toString() || "",
    lastUsed: account?.lastUsed?.toString() || "",
    statementCycleDay: account?.statementCycleDay?.toString() || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation for required fields
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === "accountName" && !value.trim()) {
      newErrors.accountName = "Account name is required";
    } else if (name === "accountName") {
      delete newErrors.accountName;
    }

    if (name === "creditLimit") {
      if (!value.trim()) {
        newErrors.creditLimit = "Credit limit is required";
      } else if (parseFloat(value) <= 0) {
        newErrors.creditLimit = "Credit limit must be greater than 0";
      } else {
        delete newErrors.creditLimit;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "accountName" || name === "creditLimit") {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors: Record<string, string> = {};

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    if (!formData.creditLimit.trim()) {
      newErrors.creditLimit = "Credit limit is required";
    } else if (parseFloat(formData.creditLimit) <= 0) {
      newErrors.creditLimit = "Credit limit must be greater than 0";
    }

    // Complex validation
    if (formData.statementCycleDay) {
      const day = parseInt(formData.statementCycleDay);
      if (day < 1 || day > 31) {
        newErrors.statementCycleDay = "Statement cycle day must be between 1 and 31";
      }
    }

    if (formData.lastUsed) {
      const month = parseInt(formData.lastUsed);
      if (month < 1 || month > 12) {
        newErrors.lastUsed = "Last used must be between 1 and 12";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const submitData: Partial<Account> = {
      accountName: formData.accountName,
      accountNumber: formData.accountNumber || undefined,
      creditLimit: parseFloat(formData.creditLimit),
      amountOwed: formData.amountOwed ? parseFloat(formData.amountOwed) : 0,
      minimumMonthlyPayment: formData.minimumMonthlyPayment
        ? parseFloat(formData.minimumMonthlyPayment)
        : 0,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      rateExpiration: formData.rateExpiration || undefined,
      rewards: formData.rewards ? parseFloat(formData.rewards) : undefined,
      lastUsed: formData.lastUsed ? parseInt(formData.lastUsed) : undefined,
      statementCycleDay: formData.statementCycleDay
        ? parseInt(formData.statementCycleDay)
        : undefined,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Information */}
      <div className="bg-white shadow-md rounded-lg px-6 pt-6 pb-8 border border-gray-200">
        <div className="mb-6 pb-3 border-b-2 border-gray-100">
          <h2 className="text-lg font-semibold mb-1">Account Information</h2>
          <p className="text-sm text-gray-600">
            Basic identification details for this account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
              Account Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`block w-full px-3.5 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all ${
                errors.accountName
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="e.g., Chase Sapphire Reserve"
              required
            />
            {errors.accountName && (
              <p className="mt-1.5 text-sm text-red-600">{errors.accountName}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              placeholder="Last 4 digits (optional)"
            />
            <p className="mt-1.5 text-xs text-gray-500">For your reference only</p>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="bg-white shadow-md rounded-lg px-6 pt-6 pb-8 border border-gray-200">
        <div className="mb-6 pb-3 border-b-2 border-gray-100">
          <h2 className="text-lg font-semibold mb-1">Financial Details</h2>
          <p className="text-sm text-gray-600">
            Credit limits, balances, and payment information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700 mb-2">
              Credit Limit <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="creditLimit"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.01"
              min="0"
              className={`block w-full px-3.5 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all ${
                errors.creditLimit
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="0.00"
              required
            />
            {errors.creditLimit && (
              <p className="mt-1.5 text-sm text-red-600">{errors.creditLimit}</p>
            )}
          </div>

          <div>
            <label htmlFor="amountOwed" className="block text-sm font-medium text-gray-700 mb-2">
              Amount Owed
            </label>
            <input
              type="number"
              id="amountOwed"
              name="amountOwed"
              value={formData.amountOwed}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="minimumMonthlyPayment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Minimum Monthly Payment
            </label>
            <input
              type="number"
              id="minimumMonthlyPayment"
              name="minimumMonthlyPayment"
              value={formData.minimumMonthlyPayment}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="rateExpiration" className="block text-sm font-medium text-gray-700 mb-2">
              Rate Expiration Date
            </label>
            <input
              type="date"
              id="rateExpiration"
              name="rateExpiration"
              value={formData.rateExpiration}
              onChange={handleChange}
              className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500">When does this interest rate expire?</p>
          </div>
        </div>
      </div>

      {/* Optional Information */}
      <div className="bg-white shadow-md rounded-lg px-6 pt-6 pb-8 border border-gray-200">
        <div className="mb-6 pb-3 border-b-2 border-gray-100">
          <h2 className="text-lg font-semibold mb-1">
            Additional Information
            <span className="ml-2 inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
              OPTIONAL
            </span>
          </h2>
          <p className="text-sm text-gray-600">Track rewards, usage patterns, and billing cycle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="rewards" className="block text-sm font-medium text-gray-700 mb-2">
              Rewards Balance
            </label>
            <input
              type="number"
              id="rewards"
              name="rewards"
              value={formData.rewards}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              placeholder="0.00"
            />
            <p className="mt-1.5 text-xs text-gray-500">Cash back or points value</p>
          </div>

          <div>
            <label htmlFor="lastUsed" className="block text-sm font-medium text-gray-700 mb-2">
              Last Used (Month 1-12)
            </label>
            <input
              type="number"
              id="lastUsed"
              name="lastUsed"
              value={formData.lastUsed}
              onChange={handleChange}
              min="1"
              max="12"
              step="1"
              className={`block w-full px-3.5 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all ${
                errors.lastUsed ? "border-red-500" : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="1-12"
            />
            {errors.lastUsed && (
              <p className="mt-1.5 text-sm text-red-600">{errors.lastUsed}</p>
            )}
            <p className="mt-1.5 text-xs text-gray-500">Track account activity</p>
          </div>

          <div>
            <label htmlFor="statementCycleDay" className="block text-sm font-medium text-gray-700 mb-2">
              Statement Cycle Day (1-31)
            </label>
            <input
              type="number"
              id="statementCycleDay"
              name="statementCycleDay"
              value={formData.statementCycleDay}
              onChange={handleChange}
              min="1"
              max="31"
              step="1"
              className={`block w-full px-3.5 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all ${
                errors.statementCycleDay
                  ? "border-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="15"
            />
            {errors.statementCycleDay && (
              <p className="mt-1.5 text-sm text-red-600">{errors.statementCycleDay}</p>
            )}
            <p className="mt-1.5 text-xs text-gray-500">
              Day of month for payment due date calculation
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="bg-white shadow-md rounded-lg px-6 py-4 border border-gray-200 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? "Saving..." : account ? "Update Account" : "Save Account"}
        </button>
      </div>
    </form>
  );
}
