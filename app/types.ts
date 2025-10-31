export interface Account {
  id: string;
  accountName: string;
  accountNumber?: string;
  creditLimit: number;
  amountOwed?: number;
  minimumMonthlyPayment?: number;
  interestRate?: number;
  rateExpiration?: string;
  rewards?: number;
  position: number;
}

export interface SummaryTotals {
  creditLimit: number;
  amountOwed: number;
  amountAvailable: number;
  minimumMonthlyPayment: number;
}