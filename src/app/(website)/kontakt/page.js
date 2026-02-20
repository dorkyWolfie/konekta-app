import ContactForm from "@/components/forms/contactForms/contactForm";
import Link from "next/link";
import { headers } from "next/headers";
import { detectLangFromHeaders, websiteTranslations } from "@/lib/i18n";

export default async function Kontakt() {
  const headersList = await headers();
  const lang = detectLangFromHeaders(headersList);
  const t = websiteTranslations[lang];

  return (
    <section>
      <h1 className="text-2xl text-center mb-3">{t.contactH1}</h1>
      <p className="text-sm font-[700] text-center mb-8">{t.contactSubtitle1}<br />{t.contactSubtitle2}</p>
      <ContactForm lang={lang} />
      <div className="w-full flex flex-row justify-between gap-6 text-xs text-[#2563eb] font-[700] uppercase mt-6">
        <Link href="/" className="hover:text-[#1e40af]">{t.toLogin}</Link>
        <Link href="https://konekta.mk" className="hover:text-[#1e40af]">{t.toKonekta}</Link>
      </div>
    </section>
  );
}
