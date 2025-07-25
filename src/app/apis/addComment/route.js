import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/modals/post";

export async function POST(request) {
  try {
    await dbConnect();

    let { postId, userId, comment } = await request.json();

    const pythonRes = await fetch(`${process.env.PYTHON_URL}/api/offensive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: comment }),
    });
    const result = await pythonRes.json();
    if(result.category=='offensive'){
        comment='offensive'
    }

    const res = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { comments: { userId: userId, text: comment } } },
      { new: true }
    );

    return NextResponse.json(
      { success: true, message: "Comment Added Successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 400 }
    );
  }
}
