import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/modals/user";

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, followedId } = await request.json();

    const followedUser = await User.findByIdAndUpdate(
      followedId,
      { $pull: { followers: userId } },
      { new: true }
    );
    const followingUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: followedId } },
      { new: true }
    );
    if(followedUser&& followingUser){
        return NextResponse.json({success:true,message:'User Followed Successfully'},{status:200})
    }
    else{
        return NextResponse.json({success:false,message:'User not followed'},{status:400})
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}
