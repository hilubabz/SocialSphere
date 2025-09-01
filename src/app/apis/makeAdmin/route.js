import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const user = await request.json();
    const result = await User.findByIdAndUpdate(
      user._id,
      { isAdmin: true },
      { new: true, runValidators: true }
    );

    if (result) {
      return NextResponse.json(
        { success: true, message: 'Admin created successfully', data: result },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to make admin' },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
}
