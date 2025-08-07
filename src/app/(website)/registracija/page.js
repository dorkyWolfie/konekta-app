import HeroForm from "@/components/forms/heroForm";
import LoginGoogle from "@/components/buttons/LoginGoogle";
import SignInForm from "@/components/forms/signInForm";
import RegisterForm from "@/components/forms/registerForm";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <section className="max-w-xl my-auto flex flex-col flex-nowrap justify-center items-center gap-8">
      <Link href="https://konekta.mk"><Image src="/konekta_logo_0.webp" alt="logo" width={150} height={150} /></Link>
      <div className="flex flex-col items-center justify-center max-md:mt-4">
        <h1 className="text-2xl text-[#111827] font-bold text-center mb-4">Добредојде во Конекта!</h1>
        <h2  className="!text-base text-[#4b5563] text-center mb-4">Регистрирај се и креирај го твојот нов конекта профил.</h2>
        <RegisterForm />
        <p className="py-2">или</p>
        <LoginGoogle />
      </div>
      <div className="w-full flex flex-row justify-between gap-6 text-xs text-[#2563eb] font-[700] uppercase">
        <Link href="/" className="hover:text-[#1e40af]">Кон најава</Link>
        <Link href="https://konekta.mk" className="hover:text-[#1e40af]">Кон конекта.мк</Link>
      </div>
    </section>
  );
}
