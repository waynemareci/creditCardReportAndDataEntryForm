// app/api/accounts/route.js
import { connectToDatabase } from '@/lib/mongodb';
import Account from '@/models/Account';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const accounts = await Account.find({ userId: 'current-user-id' }).sort({ position: 1 });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectToDatabase();
    const account = await Account.create({
      ...data,
      userId: 'current-user-id'
    });
    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
