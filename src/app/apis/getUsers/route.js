import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/modals/user";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    // Connect to DB
    await dbConnect();

    // Extract userId from query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // Get current user's following
    const currentUser = await User.findById(userId).select("following");
    const followingList = currentUser.following || [];

    // Suggest users not followed by the current user
    const suggestions = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: [new mongoose.Types.ObjectId(userId), ...followingList],
          },
        },
      },
      {
        $addFields: {
          mutualFollowers: {
            $setIntersection: [
              { $ifNull: ["$followers", []] },
              followingList,
            ],
          },
        },
      },
      {
        $addFields: {
          mutualFollowerId: { $arrayElemAt: ["$mutualFollowers", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mutualFollowerId",
          foreignField: "_id",
          as: "mutualFollowerInfo",
        },
      },
      {
        $addFields: {
          mutualFollowerName: {
            $cond: [
              { $gt: [{ $size: "$mutualFollowerInfo" }, 0] },
              { $arrayElemAt: ["$mutualFollowerInfo.name", 0] },
              null,
            ],
          },
        },
      },
      {
        $sort: { mutualFollowers: -1 },
      },
      {
        $project: {
          password: 0,
          followers: 0,
          mutualFollowerInfo: 0,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Suggestions fetched",
      data: suggestions,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: e.message },
      { status: 500 }
    );
  }
}
