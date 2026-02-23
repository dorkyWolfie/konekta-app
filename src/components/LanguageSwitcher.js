import Link from "next/link";
import FlagIcon from '@/components/FlagIcon';
import { getLangInfo } from '@/lib/languages';

export default function LanguageSwitcher({ uri, currentLang, page }) {
  const primaryLang = page.primaryLanguage || 'mk';

  // Prefer DB field; legacy fallback for unmigrated docs
  let enabledCodes = page.enabledLanguages?.length > 0
    ? page.enabledLanguages
    : page.showEnglishTranslation ? ['mk', 'en'] : ['mk'];

  // Primary language always first
  enabledCodes = [primaryLang, ...enabledCodes.filter(c => c !== primaryLang)];

  // Only show languages that actually have content
  const availableLangs = enabledCodes
    .filter(langCode => {
      const trans = page.translations?.[langCode];
      if (trans && typeof trans === 'object' && Object.values(trans).some(v => v)) return true;
      // Legacy fallback for unmigrated docs
      if (langCode === primaryLang) return !!(page.displayName || page.company || page.bio);
      if (langCode === 'en') return !!page.showEnglishTranslation;
      return false;
    })
    .map(langCode => getLangInfo(langCode))
    .filter(Boolean);

  if (availableLangs.length <= 1) return null;

  return (
    <div className="fixed top-4 right-4 z-20 flex gap-2">
      {availableLangs.map(lang => (
        <Link
          key={lang.code}
          href={`/${uri}?lang=${lang.code}`}
          className={`px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
            currentLang === lang.code
              ? 'bg-[#2563eb] text-white'
              : 'bg-white/75 text-[#374151] hover:bg-white/90'
          }`}
        >
          <FlagIcon countryCode={lang.countryCode} />
          {lang.code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
