
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function POST(request){
    await dbConnect()

    try{
        const postData=await request.json();
        
        const res=await Post.create(postData);
        return NextResponse.json({success:true,message:'Post Added Successfully'},{status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({success:false,message:'An error occured',error:e.message},{status:400})
    }
}