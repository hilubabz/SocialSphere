import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/modals/message";

export async function GET(request) {
  await dbConnect()
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const messages = await Message.find({
    $or: [
      { senderId: userId },
      { receiverId: userId },
    ],
  }).sort({ createdAt: 1 }); 

  if(messages){
    return NextResponse.json({success:true, message:"Messages fetched successfully", data:messages},{status:200})
  }
  else{
    return NextResponse.json({success:true, message:"Failed to fetch messages"},{status:400})
  }
}
