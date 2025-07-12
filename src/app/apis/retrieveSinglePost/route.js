import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function GET(request){
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    try{
        const res=await Post.findById(postId).populate('userId','_id name profilePicture')
        if(res){
            return NextResponse.json({success:true,message:'Post Fetched Successfully',data:res},{status:200})
        }
        else{
            return NextResponse.json({success:false, message:'Failed to fetch post'},{status:500})
        }
    }
    catch(e){
        return NextResponse.json({success:false, message:e.message},{status:500})
    }

}