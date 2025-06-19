"use server";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import bcryptjs from "bcryptjs"
export default async function LoginUser(user) {
    try {
        await dbConnect();

        
        const storedUser = await User.findOne({
            username: user.username,
        });
        const pass=await bcryptjs.compare(user.password,storedUser.password)
        console.log(storedUser.pass)

        return (storedUser&&pass) ? true : false;
    } catch (e) {
        console.error("Login error:", e);
        return false;
    }
}
