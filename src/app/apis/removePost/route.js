import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function POST(request){
    await dbConnect();
    try{
        const postData=await request.json()
        const res=await Post.findByIdAndDelete(postData._id)
        if(res){
            return NextResponse.json({success:true,message:'Post Deleted Successfully'},{status:200})
        }
        else{
            return NextResponse.json({success:false,message:'Failed to Delete Post'},{status:400})
        }

    }
    catch(e){
        return NextResponse.json({success:false, message:e.message},{status:500})
    }
}