import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/modals/user";

export async function POST(request) {
  await dbConnect();
  try {
    const editedData = await request.json();
    const id = editedData._id;

    delete editedData._id;

    const result = await User.findByIdAndUpdate(id, editedData, { new: true });

    if (result) {
      return NextResponse.json({ success: true, message: 'User edited successfully', data: result }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 400 });
  }
}
