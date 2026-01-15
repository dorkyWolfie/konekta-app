import { user as User } from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { subject, message, recipientFilter } = await req.json();

    await mongoose.connect(process.env.MONGO_URI);

    // Build query based on filter
    let query = {};
    if (recipientFilter === 'pro') {
      query = { subscriptionStatus: 'pro', isOnTrial: false };
    } else if (recipientFilter === 'basic') {
      query = { subscriptionStatus: 'basic' };
    } else if (recipientFilter === 'trial') {
      query = { isOnTrial: true };
    }

    const users = await User.find(query).select('email name');

    let sentCount = 0;
    let failedCount = 0;

    // Send emails
    for (const user of users) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html lang="mk">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                      <td style="background: #2563eb; padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Конекта</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                          Добар ден ${user.name || 'кориснику'}! 👋
                        </h2>
                        <div style="color: #374151; font-size: 16px; line-height: 1.6;">
                          ${message}
                        </div>
                        <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                          Поздрав и убав ден,<br>
                          <strong style="color: #111827;">Тимот на Конекта</strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                          © ${new Date().getFullYear()} Конекта. Сите права задржани.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await resend.emails.send({
          from: `Konekta <${process.env.SENDER_EMAIL}>`,
          to: user.email,
          subject: subject,
          html: emailHtml,
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${user.email}:`, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      message: 'Announcement sent',
      sentCount,
      failedCount,
      totalUsers: users.length
    });

  } catch (error) {
    console.error('Error sending announcement:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}