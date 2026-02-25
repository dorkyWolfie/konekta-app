import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewContactNotification({
  ownerEmail,
  ownerName,
  contactName,
  contactLastName,
  contactCompany,
  contactPosition,
  contactEmail,
  contactPhone,
  targetPageUri
}) {
  try {
    const fullContactName = [contactName, contactLastName].filter(Boolean).join(' ');
    
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
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                          
                          <!-- Header -->
                          <tr>
                              <td style="background: #1e40af; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                      📬 Нов контакт!
                                  </h1>
                              </td>
                          </tr>
                          
                          <!-- Content -->
                          <tr>
                              <td style="padding: 40px 30px;">
                                  <p style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600;">
                                      Здраво ${ownerName}! 👋
                                  </p>
                                  
                                  <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                      Имаш нов контакт што пристигна преку твојот Конекта профил!
                                  </p>
                                  
                                  <!-- Contact Details Box -->
                                  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin: 20px 0;">
                                      <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">
                                          Детали за контактот:
                                      </h3>
                                      
                                      ${fullContactName ? `
                                      <div style="margin-bottom: 12px;">
                                          <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Име и презиме:</span>
                                          <span style="color: #111827; font-size: 16px; font-weight: 500;">${fullContactName}</span>
                                      </div>
                                      ` : ''}
                                      
                                      ${contactCompany ? `
                                      <div style="margin-bottom: 12px;">
                                          <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Компанија:</span>
                                          <span style="color: #111827; font-size: 16px; font-weight: 500;">${contactCompany}</span>
                                      </div>
                                      ` : ''}
                                      
                                      ${contactPosition ? `
                                      <div style="margin-bottom: 12px;">
                                          <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Позиција:</span>
                                          <span style="color: #111827; font-size: 16px; font-weight: 500;">${contactPosition}</span>
                                      </div>
                                      ` : ''}
                                      
                                      ${contactEmail ? `
                                      <div style="margin-bottom: 12px;">
                                          <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Е-пошта:</span>
                                          <a href="mailto:${contactEmail}" style="color: #667eea; font-size: 16px; text-decoration: none;">${contactEmail}</a>
                                      </div>
                                      ` : ''}
                                      
                                      ${contactPhone ? `
                                      <div style="margin-bottom: 12px;">
                                          <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Телефон:</span>
                                          <a href="tel:${contactPhone}" style="color: #667eea; font-size: 16px; text-decoration: none;">${contactPhone}</a>
                                      </div>
                                      ` : ''}
                                  </div>
                                  
                                  <!-- CTA Button -->
                                  <div style="text-align: center; margin: 30px 0 20px 0;">
                                      <a href="${process.env.NEXTAUTH_URL}/contacts" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                          Погледни ги сите контакти
                                      </a>
                                  </div>
                                  
                                  <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                                      Пристигнато од профил: <strong style="color: #111827;">${targetPageUri}</strong>
                                  </p>
                              </td>
                          </tr>
                          
                          <!-- Footer -->
                          <tr>
                              <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
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

    const { data, error } = await resend.emails.send({
      from: `Konekta <${process.env.SENDER_EMAIL}>`,
      to: ownerEmail,
      subject: `[Конекта /${targetPageUri}] 📬 Имаш нов контакт од ${fullContactName || 'посетител'}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending contact notification:', error);
    return false;
  }
}