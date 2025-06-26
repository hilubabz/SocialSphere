// pages/api/mutuals.js
import dbConnect from '@/lib/mongodb';
import User from '@/modals/user';
import { NextResponse } from 'next/server';


export async function GET(request) {
  await dbConnect();

 const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: 'userId is required' });

  const user = await User.findById(userId).lean();
  if (!user) return NextResponse.json({ error: 'User not found' });

  // 1️⃣ Compute intersection of IDs
  const followersSet = new Set(user.followers.map(String));
  const mutualIds = user.following
    .map(String)
    .filter(id => followersSet.has(id));

  // 2️⃣ Fetch those users’ profiles
  const mutualProfiles = await User.find(
    { _id: { $in: mutualIds } },
    '_id name username profilePicture'
  ).lean();

  return NextResponse.json({success:true,message:'Users fetched', data: mutualProfiles },{status:200});
}
