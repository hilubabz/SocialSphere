"use server";
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/modals/post';

export async function GET(request) {
  try {
    await dbConnect();

    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId in query' },
        { status: 400 }
      );
    }

    // Fetch all posts except those by the given userId and populate user info
    const posts = await Post.find({ userId: { $ne: userId } })
      .populate('userId', 'name username profilePicture -_id')
      .lean();

    // Transform to include a `user` field instead of userId reference
    const enriched = posts.map(post => ({
      ...post,
      user: post.userId,
      userId: post.userId._id || post.userId, // preserve id if needed
    }));

    return NextResponse.json(
      { success: true, message: 'Posts retrieved', data: enriched },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: 'Retrieval failed', error: e.message },
      { status: 500 }
    );
  }
}
