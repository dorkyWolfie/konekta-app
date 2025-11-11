import { user as User } from "@/models/user";
import mongoose from "mongoose";

export async function GET(req) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find all users with expired trials
    const expiredTrials = await User.updateMany(
      {
        isOnTrial: true,
        trialEndsAt: { $lt: new Date() }
      },
      {
        $set: {
          subscriptionStatus: 'basic',
          isOnTrial: false
        }
      }
    );

    return new Response(
      JSON.stringify({ 
        message: 'Trials expired successfully',
        count: expiredTrials.modifiedCount 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error expiring trials:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }), 
      { status: 500 }
    );
  }
}