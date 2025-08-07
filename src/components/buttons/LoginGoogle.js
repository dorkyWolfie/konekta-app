'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";

export default function LoginGoogle() {
    return (
        <button 
        onClick={() => signIn('google', { callbackUrl: '/account' })}
        className="bg-white shadow-sm shadow-[#4b5563]-60 text-center w-full py-4 flex gap-3 items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-all duration-300">
            <FontAwesomeIcon icon={faGoogle} className="h-6" />
            <span>Најава со Google</span>
        </button>
    );
}