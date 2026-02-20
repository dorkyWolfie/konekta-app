'use client';
import { useRouter } from 'next/navigation';

export default function LangSwitcher({ lang }) {
  const router = useRouter();

  function switchLang() {
    const newLang = lang === 'mk' ? 'en' : 'mk';
    document.cookie = `lang=${newLang};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <button
      onClick={switchLang}
      className="flex items-center gap-1 text-xs font-[700] uppercase cursor-pointer"
    >
      <span className={lang === 'mk' ? 'text-[#111827]' : 'text-[#9ca3af]'}>MK</span>
      <span className="text-[#9ca3af]">/</span>
      <span className={lang === 'en' ? 'text-[#111827]' : 'text-[#9ca3af]'}>EN</span>
    </button>
  );
}
