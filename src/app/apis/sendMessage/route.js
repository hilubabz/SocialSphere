import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/modals/message";

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const pythonRes = await fetch(`${process.env.PYTHON_URL}/api/offensive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: data.message }),
    });
    const result=await pythonRes.json()
    if(result.category=='offensive'){
        return NextResponse.json({success:true, message:'offensive'},{status:200})
    }
    const addMessage = await Message.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      messageType: data.messageType,
    });
    if (addMessage) {
      return NextResponse.json(
        { success: true, message: "Message Sent", _id: addMessage._id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send message" },
        { success: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
