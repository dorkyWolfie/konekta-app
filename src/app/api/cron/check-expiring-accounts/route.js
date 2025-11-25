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
    
    console.log('=== Checking Expiring Accounts ===');
    console.log('Current time:', now.toISOString());

    // Get ALL trial users and check manually
    const allTrialUsers = await User.find({
      isOnTrial: true,
      trialEndsAt: { $exists: true, $ne: null }
    }).select('name email trialEndsAt');

    console.log(`Total trial users found: ${allTrialUsers.length}`);

    // Filter trial users expiring in 0-2 days (gives us a window)
    const expiringTrials = allTrialUsers.filter(user => {
      const daysUntilExpiry = Math.ceil((new Date(user.trialEndsAt) - now) / (1000 * 60 * 60 * 24));
      console.log(`User ${user.email}: expires in ${daysUntilExpiry} days (${user.trialEndsAt})`);
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 2; // 0-2 days
    });

    console.log(`Trial users expiring in 0-2 days: ${expiringTrials.length}`);

    // Get ALL pro users (not on trial) with expiration dates
    const allProUsers = await User.find({
      subscriptionStatus: 'pro',
      isOnTrial: false,
      subscriptionExpiresAt: { $exists: true, $ne: null }
    }).select('name email subscriptionExpiresAt');

    console.log(`Total pro users found: ${allProUsers.length}`);

    // Filter pro users expiring in 9-11 days
    const expiringProAccounts = allProUsers.filter(user => {
      const daysUntilExpiry = Math.ceil((new Date(user.subscriptionExpiresAt) - now) / (1000 * 60 * 60 * 24));
      console.log(`User ${user.email}: expires in ${daysUntilExpiry} days (${user.subscriptionExpiresAt})`);
      return daysUntilExpiry >= 9 && daysUntilExpiry <= 11; // 9-11 days
    });

    console.log(`Pro users expiring in 9-11 days: ${expiringProAccounts.length}`);

    // Send notifications for expiring trials
    let trialNotificationsSent = 0;
    for (const user of expiringTrials) {
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
    for (const user of expiringProAccounts) {
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
        expiringTrials: expiringTrials.length,
        trialNotificationsSent,
        expiringProAccounts: expiringProAccounts.length,
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