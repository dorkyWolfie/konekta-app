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
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    console.log('=== Checking Expiring Accounts ===');
    console.log('Current time:', now.toISOString());
    console.log('24 hours from now:', twentyFourHoursFromNow.toISOString());

    // Get trial users expiring in the next 24 hours
    const allTrialUsers = await User.find({
      isOnTrial: true,
      trialEndsAt: {
        $gte: now,
        $lte: twentyFourHoursFromNow
      }
    }).select('name email trialEndsAt');

    console.log(`Trial users expiring in next 24 hours: ${allTrialUsers.length}`);

    // Calculate 10 days from now (with 24 hour window)
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const tenDaysPlus24Hours = new Date(tenDaysFromNow.getTime() + 24 * 60 * 60 * 1000);

    // Get pro users expiring in 10 days (within a 24-hour window)
    const allProUsers = await User.find({
      subscriptionStatus: 'pro',
      isOnTrial: false,
      subscriptionExpiresAt: {
        $gte: tenDaysFromNow,
        $lte: tenDaysPlus24Hours
      }
    }).select('name email subscriptionExpiresAt');

    console.log(`Pro users expiring in 10 days (24h window): ${allProUsers.length}`);

    // Send notifications for expiring trials
    let trialNotificationsSent = 0;
    for (const user of allTrialUsers) {
      try {
        await discordExpiringAccountNotification({
          name: user.name,
          email: user.email,
          expiresAt: user.trialEndsAt,
          accountType: 'trial'
        });
        trialNotificationsSent++;
        console.log(`✓ Sent trial expiration notification to ${user.email}`);
      } catch (error) {
        console.error(`✗ Failed to send notification to ${user.email}:`, error);
      }
    }

    // Send notifications for expiring pro accounts
    let proNotificationsSent = 0;
    for (const user of allProUsers) {
      try {
        await discordExpiringAccountNotification({
          name: user.name,
          email: user.email,
          expiresAt: user.subscriptionExpiresAt,
          accountType: 'pro'
        });
        proNotificationsSent++;
        console.log(`✓ Sent pro expiration notification to ${user.email}`);
      } catch (error) {
        console.error(`✗ Failed to send notification to ${user.email}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Expiring accounts checked successfully',
        expiringTrials: allTrialUsers.length,
        trialNotificationsSent,
        expiringProAccounts: allProUsers.length,
        proNotificationsSent,
        timestamp: now.toISOString()
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking expiring accounts:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }), 
      { status: 500 }
    );
  }
}