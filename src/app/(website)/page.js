import HeroForm from "@/components/forms/heroForm";
import LoginGoogle from "@/components/buttons/LoginGoogle";
import Image from "next/image";
import SignInForm from "@/components/forms/signInForm";
import RegisterForm from "@/components/forms/registerForm";
import Link from "next/link";

export default function Login() {
  return (
    <section className="max-w-6xl my-auto flex flex-row md:justify-between items-center md:gap-20 md:flex-nowrap flex-wrap justify-center items-start">
      <div className="my-auto">
        <Image src="/login_hero.webp" alt="dekorativna slika" width={400} height={400} />
      </div>
      <div className="flex flex-col items-center justify-center max-md:mt-4">
        <div className="w-full">
          <h1 className="text-3xl text-[#111827] font-bold text-center mb-2">Добредојде во Конекта!</h1>
          <h2  className="text-base text-[#4b5563] text-center mb-4">Најави се во твојот профил.</h2>
          <LoginGoogle />
          <hr className="border-0 h-6" />
          <SignInForm />
        </div>
        <div className="mt-6">
          <p className="text-md text-[#4b5563] text-center">Немаш профил?</p>
          <Link href="/registracija" className="text-md text-[#2563eb] hover:text-[#1e40af] font-[700] text-center">Регистрирај се сега.</Link>
        </div>
      </div>
    </section>
  );
}
