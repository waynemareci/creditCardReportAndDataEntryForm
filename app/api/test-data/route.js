// app/api/test-data/route.js
import { connectToDatabase } from '@/lib/mongodb';
import Account from '@/models/Account';
import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    mongodb: { accessible: false, error: null, accountCount: 0 },
    timestamp: new Date().toISOString()
  };

  // Test MongoDB connection and data access
  try {
    await connectToDatabase();
    const accounts = await Account.find({ userId: 'current-user-id' });
    results.mongodb.accessible = true;
    results.mongodb.accountCount = accounts.length;
    results.mongodb.accounts = accounts;
  } catch (error) {
    results.mongodb.error = error.message;
  }

  return NextResponse.json(results);
}
