import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/modals/user";
import Post from "@/modals/post";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Id not defined" },
        { status: 500 }
      );
    }

    const posts = await Post.find({
      $and: [{ userId: { $ne: userId } }, { userId: { $in: user.following } }],
    })
      .populate("userId", "_id name username profilePicture")
      .lean();
    return NextResponse.json({success:true,message:'Post Retrieved',data:posts},{status:200})
  } catch (e) {
    console.log(e);
    return NextResponse.json({success:false,message:e.message})
  }
}
