import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/modals/user";
import bcryptjs from "bcryptjs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export async function POST(request) {
  await dbConnect();
  const saltRounds = 10;
  try {
    const userData = await request.json();
    userData.password = await bcryptjs.hash(userData.password, saltRounds);
    const user = await User.create(userData);
    return NextResponse.json(
      { success: true, data: "Registered Successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, data: e.message },
      { status: 500 }
    );
  }
}
