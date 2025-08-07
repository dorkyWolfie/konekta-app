import { user as UserModel } from "@/models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ message: "User created" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
