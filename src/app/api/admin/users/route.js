import { user as User } from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const users = await User.find({})
      .select('name email subscriptionStatus isOnTrial trialEndsAt subscriptionExpiresAt provider createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error in admin users API:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Server error', details: error.message }, 
      { status: 500 }
    );
  }
}