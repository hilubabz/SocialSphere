

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import mongoose from 'mongoose';


export async function GET(request){
    try{
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
            return NextResponse.json({success:false,message:'UserId is not defined'},{status:404})
        }
        const res=await User.find({_id:{$ne:userId}}).select("-password")
        return NextResponse.json({success:true,message:'Users fetched',data:res},{status:200})
    }
    catch(e){
        console.log(e)
    }
}