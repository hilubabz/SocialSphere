import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/modals/message";


export async function POST(request){
    try{
        await dbConnect();
        const data=await request.json()
        const addMessage=await Message.create({senderId:data.userId, receiverId:data.receiverId, message:data.message})
        if(addMessage){
            return NextResponse.json({success:true,message:'Message Sent'},{status:200})
        }
        else{
            return NextResponse.json({success:false,message:'Failed to send message'},{success:400})
        }
    }
    catch(error){
        console.log(error)
    }
}