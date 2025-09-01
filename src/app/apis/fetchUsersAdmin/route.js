import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import { NextResponse } from 'next/server';

export async function GET(request){
    await dbConnect();

    try{
        const result=await User.find();
        if(result){
            return NextResponse.json({success:true,message:'User fetched successfully',data:result},{status:200})
        }
        else{
            return NextResponse.json({success:false,message:'Failed to fetch users'},{status:400})
        }
    }
    catch(e){
        return NextResponse.json({success:false,message:e.message},{status:500})
    }
}