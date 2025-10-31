// app/api/accounts/reorder/route.js
import { connectToDatabase } from '@/lib/mongodb';
import Account from '@/models/Account';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accountId, direction } = await request.json();
    await connectToDatabase();

    // Get all accounts sorted by position
    const accounts = await Account.find({ userId: 'current-user-id' }).sort({ position: 1 });

    // Find current account index
    const currentIndex = accounts.findIndex(acc => acc._id.toString() === accountId);

    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Determine new index
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    // Check bounds
    if (newIndex < 0 || newIndex >= accounts.length) {
      return NextResponse.json({ error: 'Cannot move account in that direction' }, { status: 400 });
    }

    // Swap positions
    const currentAccount = accounts[currentIndex];
    const otherAccount = accounts[newIndex];

    const tempPosition = currentAccount.position;
    currentAccount.position = otherAccount.position;
    otherAccount.position = tempPosition;

    // Save both accounts
    await currentAccount.save();
    await otherAccount.save();

    // Return updated list
    const updatedAccounts = await Account.find({ userId: 'current-user-id' }).sort({ position: 1 });
    return NextResponse.json(updatedAccounts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
