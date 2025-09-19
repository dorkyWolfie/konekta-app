import Link from "next/link";
import { MK, GB } from 'country-flag-icons/react/3x2';

export default function LanguageSwitcher({ uri, currentLang = 'mk', page }) {
  // Check if English content exists
  const hasEnglishContent = page && (
    page.displayName_en ||
    page.company_en ||
    page.position_en ||
    page.location_en ||
    page.bio_en ||
    (page.buttons && page.buttons.some(button => button.title_en)) ||
    (page.links && page.links.some(link => link.title_en || link.subtitle_en)) ||
    (page.files && page.files.some(file => file.title_en || file.description_en))
  );

  // Don't show switcher if no English content exists
  if (!hasEnglishContent) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-20 flex gap-2">
      <Link
        href={`/${uri}`}
        className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
          currentLang === 'mk'
            ? 'bg-[#2563eb] text-white'
            : 'bg-white/75 text-[#374151] hover:bg-white/90'
        }`}
      >
<MK className="w-4 h-3" /> MK
      </Link>
      <Link
        href={`/${uri}?lang=en`}
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