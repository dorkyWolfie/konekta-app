import { user as User } from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'User ID and updates required' }, 
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    // Prepare the update object
    const updateData = {
      name: updates.name,
      subscriptionStatus: updates.subscriptionStatus,
      isOnTrial: updates.isOnTrial
    };

    // Handle date fields - convert to Date objects or null
    if (updates.trialEndsAt) {
      updateData.trialEndsAt = new Date(updates.trialEndsAt);
    } else {
      updateData.trialEndsAt = null;
    }

    if (updates.subscriptionExpiresAt) {
      updateData.subscriptionExpiresAt = new Date(updates.subscriptionExpiresAt);
    } else {
      updateData.subscriptionExpiresAt = null;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('name email subscriptionStatus isOnTrial trialEndsAt subscriptionExpiresAt');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message }, 
      { status: 500 }
    );
  }
}