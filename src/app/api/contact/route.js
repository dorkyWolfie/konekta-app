import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const data = await req.json();
    const { tip, ime, prezime, email, telefon, poraka, selectedPlan, selectedProduct, kolicina } = data;

    let subject = '';
    let html = '';

    switch (tip) {
      case 'kontakt':
        subject = `[Конекта] Контакт порака од ${ime} ${prezime}`;
        html = `
          <h2>Контакт форма</h2>
          <p><strong>Име:</strong> ${ime} ${prezime}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Телефон:</strong> ${telefon || 'не е внесен'}</p>
          <p><strong>Порака:</strong><br/>${poraka}</p>
        `;
        break;

      case 'paket':
        subject = `[Конекта] Нарачка на пакет: ${selectedPlan}`;
        html = `
          <h2>Нарачка за пакет</h2>
          <p><strong>Име:</strong> ${ime} ${prezime}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Пакет:</strong> ${selectedPlan}</p>
          <p><strong>Порака:</strong><br/>${poraka}</p>
        `;
        break;

      case 'proizvod':
        subject = `[Конекта] Нарачка за производ: ${selectedProduct}`;
        html = `
          <h2>Нарачка на производ</h2>
          <p><strong>Име:</strong> ${ime} ${prezime}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Производ:</strong> ${selectedProduct}</p>
          <p><strong>Количина:</strong> ${kolicina}</p>
          <p><strong>Порака:</strong><br/>${poraka}</p>
        `;
        break;

      default:
        return new Response(JSON.stringify({ error: 'Непознат тип' }), { status: 400 });
    }

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
