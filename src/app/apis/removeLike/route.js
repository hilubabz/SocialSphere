
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { postId, userId } = body;

    if (!postId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing postId or userId' }, { status: 400 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    return NextResponse.json({ success: true, message:"Like Removed Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
