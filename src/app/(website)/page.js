import LoginGoogle from "@/components/buttons/LoginGoogle";
import Image from "next/image";
import SignInForm from "@/components/forms/signInForm";
import Link from "next/link";
import LangSwitcher from "@/components/ui/langSwitcher";
import { headers } from "next/headers";
import { detectLangFromHeaders, websiteTranslations } from "@/lib/i18n";

export default async function Login() {
  const headersList = await headers();
  const lang = detectLangFromHeaders(headersList);
  const t = websiteTranslations[lang];

  return (
    <section className="max-w-6xl my-auto flex flex-row md:justify-between items-center md:gap-20 md:flex-nowrap flex-wrap justify-center items-start">
      <div className="my-auto">
        <Image src="/login_hero.webp" alt="dekorativna slika" width={400} height={400} />
      </div>
      <div className="flex flex-col items-center justify-center max-md:mt-4">
        <div className="w-full">
          <h1 className="text-3xl text-[#111827] font-bold text-center mb-2">{t.loginH1}</h1>
          <h2 className="text-base text-[#4b5563] text-center mb-4">{t.loginH2}</h2>
          <LoginGoogle lang={lang} />
          <hr className="border-0 h-6" />
          <SignInForm lang={lang} />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-[#4b5563] font-[600] pb-1">{t.noProfile}</p>
          <Link href="/registracija" className="text-md text-[#2563eb] hover:text-[#1e40af] font-[700]">{t.registerLink}</Link>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-6 text-xs text-[#2563eb] font-[700] uppercase mt-6">
          <Link href="/account" className="hover:text-[#1e40af]">{t.toProfile}</Link>
          <LangSwitcher lang={lang} />
          <Link href="https://konekta.mk" className="hover:text-[#1e40af]">{t.toKonekta}</Link>
        </div>
      </div>
    </section>
  );
}
