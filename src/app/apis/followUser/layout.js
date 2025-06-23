import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';

export async function POST(request){
    try{
        await dbConnect();
        const {userId,followedId}=request.json()
        
    }
    catch(e){
        console.log(e)
        return NextResponse.json({success:false,message:e.message},{status:400})
    }
}