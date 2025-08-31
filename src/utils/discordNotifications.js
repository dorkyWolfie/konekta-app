export async function discordRegistrationNotification(userData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('Discord webhook URL not configured');
    return;
  }

  const { email, provider, timestamp, name, isNewUser, subscriptionStatus } = userData;
  
  const embed = {
    title: isNewUser ? "🎉 New User Registration" : "👋 User Sign In",
    color: provider === 'google' ? 0xfddc00 : 0x5865f2,
    fields: [
      {
        name: "",
        value: `👤 **Name:** ${name}`,
        inline: false
      },
      {
        name: "",
        value: `📧 **Email:** ${email}`,
        inline: false
      },
      {
        name: "",
        value: `🔐 **Provider:** ${provider === 'google' ? '🟦 Google OAuth' : '📧 Email & Password'}`,
        inline: false
      },
      {
        name: "",
        value: `💎 **Subscription:** ${subscriptionStatus === 'pro' ? '✨ Pro' : '🆓 Basic'}`,
        inline: false
      },
      {
        name: "",
        value: `⏰ **Time:** <t:${Math.floor(timestamp.getTime() / 1000)}:F>`,
        inline: false
      }
    ],
    footer: {
      text: isNewUser ? "New registration completed" : "Existing user signed in"
    },
    timestamp: timestamp.toISOString()
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Registration Bot',
        embeds: [embed]
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Discord notification:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}