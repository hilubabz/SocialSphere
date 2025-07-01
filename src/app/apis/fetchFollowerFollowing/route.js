import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/modals/user";

export async function GET(request){
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    try{
        const res=await User.findById(userId).select('followers following')
        if(res){
            return NextResponse.json({success:true,message:'Follower and Following fetched successfully', data:res},{status:200})
        }
        else{
            return NextResponse.json({success:false,message:'Failed to fetch Follower and Following'},{status:400})
        }
    }
    catch(e)
    {
        return NextResponse.json({success:false,message:e.message},{status:500})
    }
}