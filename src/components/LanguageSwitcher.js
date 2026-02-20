import Link from "next/link";
import { MK, GB } from 'country-flag-icons/react/3x2';
import { hasEnglishContent, hasMacedonianContent } from '@/lib/i18n';

export default function LanguageSwitcher({ uri, currentLang, page }) {
  const showEN = hasEnglishContent(page);
  const showMK = hasMacedonianContent(page);

  // Only show the switcher when both languages have content to show
  if (!showEN || !showMK) return null;

  return (
    <div className="fixed top-4 right-4 z-20 flex gap-2">
      <Link
        href={`/${uri}?lang=mk`}
        className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
          currentLang === 'mk'
            ? 'bg-[#2563eb] text-white'
            : 'bg-white/75 text-[#374151] hover:bg-white/90'
        }`}
      >
<MK className="w-4 h-3" /> MK
      </Link>
      <Link
        href={`/${uri}`}
        className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
          currentLang === 'en'
            ? 'bg-[#2563eb] text-white'
            : 'bg-white/75 text-[#374151] hover:bg-white/90'
        }`}
      >
<GB className="w-4 h-3" /> EN
      </Link>
    </div>
  );
}