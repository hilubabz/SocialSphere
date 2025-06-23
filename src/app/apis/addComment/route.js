
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function POST(request){
    try{
        await dbConnect()

        const {postId,userId,comment}=await request.json()

        const res=await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { comments: {userId:userId,text:comment} } },
            { new: true }
        )

        return NextResponse.json({success:true, message:'Comment Added Successfully'},{status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({success:false,message:e.message},{status:400})
    }
}