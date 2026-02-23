// Supported translation languages (excludes MK which is always the primary language)
export const SUPPORTED_LANGUAGES = [
  { code: 'en', countryCode: 'GB', name: 'English' },
  { code: 'sr', countryCode: 'RS', name: 'Srpski' },
  { code: 'hr', countryCode: 'HR', name: 'Hrvatski' },
  { code: 'sq', countryCode: 'AL', name: 'Shqip' },
  { code: 'tr', countryCode: 'TR', name: 'Türkçe' },
  { code: 'bg', countryCode: 'BG', name: 'Български' },
  { code: 'ro', countryCode: 'RO', name: 'Română' },
  { code: 'ru', countryCode: 'RU', name: 'Русский' },
  { code: 'sl', countryCode: 'SI', name: 'Slovenščina' },
  { code: 'bs', countryCode: 'BA', name: 'Bosanski' },
  { code: 'cs', countryCode: 'CZ', name: 'Čeština' },
  { code: 'pl', countryCode: 'PL', name: 'Polski' },
  { code: 'uk', countryCode: 'UA', name: 'Українська' },
  { code: 'el', countryCode: 'GR', name: 'Ελληνικά' },
  { code: 'de', countryCode: 'DE', name: 'Deutsch' },
  { code: 'fr', countryCode: 'FR', name: 'Français' },
  { code: 'es', countryCode: 'ES', name: 'Español' },
  { code: 'it', countryCode: 'IT', name: 'Italiano' },
  { code: 'pt', countryCode: 'PT', name: 'Português' },
  { code: 'nl', countryCode: 'NL', name: 'Nederlands' },
];

export const VALID_LANG_CODES = SUPPORTED_LANGUAGES.map(l => l.code);

// MK primary language entry (used for LanguageSwitcher display)
export const MK_LANGUAGE = { code: 'mk', countryCode: 'MK', name: 'Македонски' };

export function getLangInfo(code) {
  if (code === 'mk') return MK_LANGUAGE;
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || null;
}
