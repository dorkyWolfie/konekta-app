'use client';
import {
  GB, DE, FR, ES, IT, PT, AL, TR, RS, HR, BG, RO, RU, SI, BA, PL, NL, UA, GR, MK
} from 'country-flag-icons/react/3x2';

const flagMap = { GB, DE, FR, ES, IT, PT, AL, TR, RS, HR, BG, RO, RU, SI, BA, PL, NL, UA, GR, MK };

export default function FlagIcon({ countryCode, className }) {
  const Flag = flagMap[countryCode];
  if (!Flag) return null;
  return <Flag className={className || 'w-4 h-3'} />;
}
