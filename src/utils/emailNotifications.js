import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function welcomeEmail({ email, name, provider }) {
  try {
    const welcomeSubject = "Welcome to our platform! 🎉";
    
    // Different welcome messages based on provider
    const providerMessage = provider === 'google' 
      ? "Ти благодариме што креираше Конекта профил со Google! Твојот профил е успешно регистриран."
      : "Ти благодариме што креираше Конекта профил! Твојот профил е успешно регистриран.";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Добрадојде!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 2.2em;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .provider-badge {
          display: inline-block;
          background: ${provider === 'google' ? '#4285f4' : '#5865f2'};
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9em;
          margin: 10px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 25px;
          margin: 20px 0;
          font-weight: bold;
        }
        .features {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin: 15px 0;
        }
        .feature-icon {
          font-size: 1.5em;
          margin-right: 15px;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 0.9em;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Добредојде во Конекта ${name ? `, ${name}` : ''}!</h1>
      </div>
      
      <div class="content">
        <h2>Ти благодариме што ни се придружи! 🚀</h2>
        <p>${providerMessage}</p>
        
        <div class="provider-badge">
          ${provider === 'google' ? '🟦 Signed up with Google' : '📧 Email Registration'}
        </div>
        
        <p>We're excited to have you as part of our community. Here's what you can do next:</p>
      </div>

      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">✨</span>
          <div>
            <strong>Explore Features</strong><br>
            Discover all the amazing tools we have to offer
          </div>
        </div>
        
        <div class="feature-item">
          <span class="feature-icon">🔧</span>
          <div>
            <strong>Complete Your Profile</strong><br>
            Add more details to personalize your experience
          </div>
        </div>
        
        <div class="feature-item">
          <span class="feature-icon">🎯</span>
          <div>
            <strong>Start Your Journey</strong><br>
            Jump right in and make the most of your account
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL || 'https://yoursite.com'}/dashboard" class="cta-button">
          Get Started Now →
        </a>
      </div>

      <div class="footer">
        <p>Need help? Just reply to this email and we'll be happy to assist you!</p>
        <p>© 2025 Your Company Name. All rights reserved.</p>
      </div>
    </body>
    </html>`;

    const textContent = `
Welcome aboard${name ? `, ${name}` : ''}! 🎉

${providerMessage}

Here's what you can do next:
✨ Explore Features - Discover all the amazing tools we have to offer
🔧 Complete Your Profile - Add more details to personalize your experience  
🎯 Start Your Journey - Jump right in and make the most of your account

Get started: ${process.env.NEXTAUTH_URL || 'https://yoursite.com'}/dashboard

Need help? Just reply to this email and we'll be happy to assist you!

© 2025 Your Company Name. All rights reserved.
`;

    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: [email],
      subject: welcomeSubject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}