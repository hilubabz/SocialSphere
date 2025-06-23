
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';

export async function GET(request){
    try{
        await dbConnect()

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if(!userId){
            return NextResponse.json({success:true,message:'UserId is not defined'},{status:404})
        }

        const res=await User.findById(userId).select("-password")
        return NextResponse.json({success:true, data:res, message:'User Retrieved'},{status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({success:false,message:e.message},{status:400})
    }
}