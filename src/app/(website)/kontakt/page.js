import ContactForm from "@/components/forms/contactForms/contactForm";
import Link from "next/link";

export default function Kontakt() {
  return (
    <section>
      <h1 className="text-2xl text-center mb-3">Контактирај не!</h1>
      <p className="text-sm font-[700] text-center mb-8">Имаш прашања или забелешки?<br />Пополни ја формата и ќе те контатираме во најкраток можен рок!</p>
      <ContactForm />
      <div className="w-full flex flex-row justify-between gap-6 text-xs text-[#2563eb] font-[700] uppercase mt-6">
        <Link href="/" className="hover:text-[#1e40af]">Кон најава</Link>
        <Link href="https://konekta.mk" className="hover:text-[#1e40af]">Кон конекта.мк</Link>
      </div>
    </section>
  );
}