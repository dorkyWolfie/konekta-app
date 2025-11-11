import { user as User } from "@/models/user";
import { discordRegistrationNotification } from "@/utils/discordNotifications";
import { welcomeEmail } from "@/utils/emailNotifications";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Задолжително внесете е-пошта и лозинка" }), 
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Лозинката мора да има барем 6 карактери" }), 
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Корисникот веќе постои" }), 
      { status: 400 });
    }

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: name?.trim() || null,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'credentials',
      subscriptionStatus: 'pro',
      isOnTrial: true, // Mark as trial user
      trialEndsAt: trialEndsAt, // Set trial expiration
      isNewUser: true,
      lastLoginAt: new Date()
    });

    await discordRegistrationNotification({
      email: newUser.email,
      name: newUser.name,
      provider: 'credentials',
      timestamp: new Date(),
      isNewUser: true,
      subscriptionStatus: newUser.subscriptionStatus,
      isOnTrial: newUser.isOnTrial,
      trialEndsAt: newUser.trialEndsAt
    });

    await welcomeEmail({
      email: newUser.email,
      name: newUser.name,
      provider: 'credentials'
    });

    return new Response(
      JSON.stringify({ 
        message: "User created successfully",
        userId: newUser._id 
      }), 
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: "Server error" }), 
      { status: 500 }
    );
  }
}
