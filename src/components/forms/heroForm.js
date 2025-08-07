'use client';
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HeroForm() {
    useEffect(() => {
        if (
            'localStorage' in window
            && window.localStorage.getItem('desiredUsername')
        ) {
            const username = window.localStorage.getItem('desiredUsername');
            window.localStorage.removeItem('desiredUsername');
            redirect('/account?desiredUsername=' + username);
        }
    }, []);
    async function handleSubmit(ev) {
      ev.preventDefault();
      const form = ev.target;
      const input = form.querySelector('input');
      const username = input.value;
      if (username.length > 0) {
        window.localStorage.setItem('desiredUsername', username);
        await signIn('google');
      }
    }

    return (
    <form onSubmit={handleSubmit} className="inline-flex items-center shadow-xs shadow-[#4b5563]/50 bg-white ">
      <span className="bg-none py-4 pl-4">konekta.mk/</span>
      <input type="text" className="border-none self-center hover:text-[#1d4ed8]" placeholder="username" style={{background: 'none', marginBottom: 0, paddingLeft: 1}} />
      <button type="submit" className="bg-[#3b82f6] border-2 border-transparent text-white py-4 px-6 hover:bg-transparent hover:text-[#2563eb] hover:border-2 hover:border-[#3b82f6]">Креирај</button>
    </form>
  );
}