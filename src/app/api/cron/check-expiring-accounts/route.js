import { user as User } from "@/models/user";
import { discordExpiringAccountNotification } from "@/utils/discordNotifications";
import mongoose from "mongoose";

export async function GET(req) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const now = new Date();
    
    // Calculate date ranges
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    const oneDayFromNowEnd = new Date(oneDayFromNow);
    oneDayFromNowEnd.setHours(23, 59, 59, 999);
    const oneDayFromNowStart = new Date(oneDayFromNow);
    oneDayFromNowStart.setHours(0, 0, 0, 0);

    const tenDaysFromNow = new Date(now);
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
    const tenDaysFromNowEnd = new Date(tenDaysFromNow);
    tenDaysFromNowEnd.setHours(23, 59, 59, 999);
    const tenDaysFromNowStart = new Date(tenDaysFromNow);
    tenDaysFromNowStart.setHours(0, 0, 0, 0);

    // Find trial accounts expiring in 1 day
    const expiringTrials = await User.find({
      isOnTrial: true,
      trialEndsAt: {
        $gte: oneDayFromNowStart,
        $lte: oneDayFromNowEnd
      }
    }).select('name email trialEndsAt');

    // Find pro accounts expiring in 10 days
    const expiringProAccounts = await User.find({
      subscriptionStatus: 'pro',
      isOnTrial: false,
      subscriptionExpiresAt: {
        $gte: tenDaysFromNowStart,
        $lte: tenDaysFromNowEnd
      }
    }).select('name email subscriptionExpiresAt');

    // Send notifications for expiring trials
    for (const user of expiringTrials) {
      await discordExpiringAccountNotification({
        name: user.name,
        email: user.email,
        expiresAt: user.trialEndsAt,
        accountType: 'trial'
      });
    }

    // Send notifications for expiring pro accounts
    for (const user of expiringProAccounts) {
      await discordExpiringAccountNotification({
        name: user.name,
        email: user.email,
        expiresAt: user.subscriptionExpiresAt,
        accountType: 'pro'
      });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Expiring accounts checked successfully',
        expiringTrials: expiringTrials.length,
        expiringProAccounts: expiringProAccounts.length
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking expiring accounts:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }), 
      { status: 500 }
    );
  }
}