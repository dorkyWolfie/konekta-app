import { user as User } from "@/models/user";
import { discordRegistrationNotification } from "@/utils/discordNotifications";
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

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'credentials',
      subscriptionStatus: 'basic',
      isNewUser: true,
      lastLoginAt: new Date()
    });

    await discordRegistrationNotification({
      email: newUser.email,
      name: newUser.name,
      provider: 'credentials',
      timestamp: new Date(),
      isNewUser: true,
      subscriptionStatus: newUser.subscriptionStatus
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
