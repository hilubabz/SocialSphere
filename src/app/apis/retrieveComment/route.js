
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function GET(request){
    try{
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        const post=await Post.findById(postId).populate('comments.userId','_id name username profilePicture')

        return NextResponse.json({success:true,message:'Comments Retrieved',data:post.comments},{status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({success:false,message:e.message},{status:400})
    }
}