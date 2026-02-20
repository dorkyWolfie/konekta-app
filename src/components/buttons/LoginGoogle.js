'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";
import { websiteTranslations } from "@/lib/i18n";

export default function LoginGoogle({ lang = 'mk' }) {
    const t = websiteTranslations[lang] || websiteTranslations.mk;
    return (
        <button
        onClick={() => signIn('google', { callbackUrl: '/account' })}
        className="bg-white shadow-sm shadow-[#4b5563]-60 text-center w-full py-4 flex gap-3 items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-all duration-300">
            <FontAwesomeIcon icon={faGoogle} className="h-6" />
            <span>{t.loginWithGoogle}</span>
        </button>
    );
}