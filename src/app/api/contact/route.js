import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const data = await req.json();
    const { ime, prezime, email, telefon, poraka} = data;

    let subject = '';
    let html = '';

    subject = `[Konekta App] Контакт порака од ${ime} ${prezime}`;
    html = `
      <h2>Контакт форма</h2>
      <p><strong>Име:</strong> ${ime} ${prezime}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Телефон:</strong> ${telefon || 'не е внесен'}</p>
      <p><strong>Порака:</strong><br/>${poraka}</p>
    `;

    await resend.emails.send({
      from: `Konekta <${process.env.SENDER_EMAIL}>`,
      to: process.env.RECEIVER_EMAIL,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
