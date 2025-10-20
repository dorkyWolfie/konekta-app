import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function welcomeEmail({ email, name, provider }) {
  try {
    const welcomeSubject = "Добредојде во Конекта! 🎉";
    
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
      <title>Добредојде во Конекта 🚀!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        i {
          font-size: 1.4em;
          padding: 0 6px;
          color: #666;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          background: #2563eb;
          color: white;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 2.2em;
          line-height: normal;
        }
        .content,
        .features {
          background: #f5f5f5;
          padding: 30px;
          margin-bottom: 20px;
        }
        .provider-badge {
          display: inline-block;
          background: ${provider === 'google' ? '#4285f4' : '#5865f2'};
          color: white;
          padding: 5px 15px;
          font-size: 0.9em;
          margin: 10px 0;
        }
        .cta-button {
          display: inline-block;
          background: #2563eb;
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          margin: 20px 0;
          font-weight: bold;
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
        .footer a {
          background: #eee;
          color: #2563eb;
          text-decoration: none;
          padding: 14px 15px;
          border-radius: 30px;
        }
        .footer a:hover {
          background: #2563eb;
          color: #eee;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Здраво, и добредојде во Конекта 👋 ${name ? `, ${name}` : ''}!</h1>
      </div>
      <div class="content">
        <h2>Драго ни е што одбра да бидеш дел од нашата заедница.</h2>
        <p>${providerMessage}</p>
        <div class="provider-badge">
          ${provider === 'google' ? 'Се најави со Google' : '📧 Се регистрираше со е-пошта'}
        </div>
        <p>👉 Доколку твојот профил сè уште не е активен, те молиме почекај неколку минути и обиди се повторно.</p>
        <p>Ако и по 5 минути не се појави, можно е да настанала грешка. Но, не грижи се – секогаш можеш да ни пишеш и ние брзо ќе ја поправиме.</p>
        <p>Во меѓувреме, еве што можеш да направиш за да го искористиш максимумот од Конекта:</p>
      </div>
      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">✨</span>
          <div>
            <strong>Истражи ги карактеристиките</strong><br>
            Откриј како твојата дигитална картичка може да ти помогне полесно да се поврзеш со луѓето.
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔧</span>
          <div>
            <strong>Комплетирај го твојот профил</strong><br>
            Додади ги сите важни детали – контакт информации, линкови, портфолио – и направи го профилот уникатен како тебе.
          </div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🎯</span>
          <div>
            <strong>Започни го твоето патување</strong><br>
            Конекта е тука за да создава паметни и квалитетни конекции. Искористи ја целосно и направи го твоето патување низ кариерата и животот уште поуспешно.
          </div>
        </div>
      </div>
      <div class="features">Ти посакуваме добредојде и со нетрпение очекуваме да видиме како ќе ја користиш Конекта!</div>
      <div style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/account" class="cta-button">
          Најави се тука →
        </a>
      </div>
      <div class="footer">
        <div>
          <a href="https://konekta.mk"><i class="fa-solid fa-globe"></i></a>
          <a href="https://app.konekta.mk"><i class="fa-solid fa-user"></i></a>
          <a href="https://www.facebook.com/profile.php?id=61578597457088"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://www.instagram.com/konektamk"><i class="fa-brands fa-instagram"></i></a>
          <a href="mailto:info@konekta.mk"><i class="fa-solid fa-envelope"></i></a>
        </div>
        <p>Ти треба помош? Одговори на оваа е-пошта и со задоволство ќе ти помогнеме!</p>
        <p>© 2025 Конекта. Сите права се заджани.</p>
      </div>
    </body>
    </html>`;

    const textContent = `
Здраво, и добредојде во Конекта 👋 ${name ? `, ${name}` : ''}!

${providerMessage}

Eве што можеш да направиш за да го искористиш максимумот од Конекта:
✨ Истражи ги карактеристиките - Откриј како твојата дигитална картичка може да ти помогне полесно да се поврзеш со луѓето.
🔧 Комплетирај го твојот профил - Додади ги сите важни детали – контакт информации, линкови, портфолио – и направи го профилот уникатен како тебе.  
🎯 Започни го твоето патување - Конекта е тука за да создава паметни и квалитетни конекции. Искористи ја целосно и направи го твоето патување низ кариерата и животот уште поуспешно.

Започни тука: ${process.env.NEXTAUTH_URL}/account

Ти треба помош? Одговори на оваа е-пошта и со задоволство ќе ти помогнеме!

© 2025 Конекта. Сите права се заджани.
`;

    const { data, error } = await resend.emails.send({
      from: process.env.RECEIVER_EMAIL,
      to: [email],
      subject: welcomeSubject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    // console.log('Welcome email sent successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}