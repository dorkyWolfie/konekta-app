import { user as User } from "@/models/user";
import { page as Page } from "@/models/page";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const users = await User.find({})
      .select('name email subscriptionStatus isOnTrial trialEndsAt subscriptionExpiresAt provider createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const pages = await Page.find({}).select('owner uri').lean();
    const pageUriByOwner = Object.fromEntries(pages.map(p => [p.owner, p.uri]));

    const usersWithUri = users.map(u => ({
      ...u,
      pageUri: pageUriByOwner[u.email] || null
    }));

    return NextResponse.json({ users: usersWithUri }, { status: 200 });
  } catch (error) {
    console.error('Error in admin users API:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Server error', details: error.message }, 
      { status: 500 }
    );
  }
}