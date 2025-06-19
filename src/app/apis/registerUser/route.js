"use server"

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import bcryptjs from 'bcryptjs';

export async function POST(request) {
  await dbConnect();

  try {
    const userData = await request.json();

    // --- DOB Validation (User must be at least 16) ---
    const dob = new Date(userData.dob); // assuming userData.dob is in ISO format (e.g., "2008-01-15")
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const hasBirthdayPassed = (
      today.getMonth() > dob.getMonth() || 
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
    );
    const finalAge = hasBirthdayPassed ? age : age - 1;

    if (isNaN(dob) || finalAge < 16) {
      return NextResponse.json({
        success: false,
        error: 'User must be at least 16 years old',
      }, { status: 400 });
    }

    // --- Check if username or email already exists ---
    const usernameExists = await User.findOne({ username: userData.username });
    const emailExists = await User.findOne({ email: userData.email });

    if (usernameExists && emailExists) {
      return NextResponse.json({
        success: false,
        error: 'Username and email already exist'
      }, { status: 400 });
    } else if (usernameExists) {
      return NextResponse.json({
        success: false,
        error: 'Username already exists'
      }, { status: 400 });
    } else if (emailExists) {
      return NextResponse.json({
        success: false,
        error: 'Email already exists'
      }, { status: 400 });
    }

    // --- Hash password and register user ---
    // userData.password = await bcryptjs.hash(userData.password, saltRounds);
    // const user = await User.create(userData);

    return NextResponse.json({
      success: true,
      message: 'Valid Registration'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}
