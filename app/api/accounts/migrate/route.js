// app/api/accounts/migrate/route.js
import { connectToDatabase } from '@/lib/mongodb';
import Account from '@/models/Account';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accounts } = await request.json();
    await connectToDatabase();
    
    // Clear existing accounts for this user
    await Account.deleteMany({ userId: 'current-user-id' });
    
    // Insert all accounts
    const result = await Account.insertMany(
      accounts.map(account => ({
        ...account,
        userId: 'current-user-id'
      }))
    );
    
    return NextResponse.json({ success: true, count: result.length });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
