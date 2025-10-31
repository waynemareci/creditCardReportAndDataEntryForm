// models/Account.js
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  accountNumber: String,
  creditLimit: { type: Number, required: true },
  amountOwed: { type: Number, default: 0 },
  minimumMonthlyPayment: { type: Number, default: 0 },
  interestRate: { type: Number, default: 0 },
  rateExpiration: String,
  rewards: { type: Number, default: 0 },
  lastUsed: Number,
  statementCycleDay: { type: Number, min: 1, max: 31 }, // Day of month for statement cycle
  position: { type: Number, required: true },
  userId: { type: String, required: true } // For multi-user support
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
