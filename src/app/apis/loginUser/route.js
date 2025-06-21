"use server";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import bcryptjs from "bcryptjs"
export async function POST(request) {
    try {
        await dbConnect();

        const user=await request.json()
        const storedUser = await User.findOne({
            username: user.username,
        });

        if (!storedUser) {
            return NextResponse.json({success:false, message:'User not found'},{status:400});
        }

        const pass = await bcryptjs.compare(user.password, storedUser.password);
        const id = storedUser._id;

        if (pass) {
            return NextResponse.json({success:true, data:id, message:'Login Successful'},{status:200});
        } else {
            return NextResponse.json({success:false, message:'Login Failed'},{status:400});
        }
    } catch (e) {
        console.error("Login error:", e);
        return false;
    }
}
