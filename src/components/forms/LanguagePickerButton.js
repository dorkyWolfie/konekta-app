'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import FlagIcon from '@/components/FlagIcon';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';

export default function LanguagePickerButton({ enabledLanguages, primaryLanguage, onAdd }) {
  const [showPicker, setShowPicker] = useState(false);

  const available = SUPPORTED_LANGUAGES.filter(l =>
    !enabledLanguages.includes(l.code) && l.code !== primaryLanguage
  );

  if (available.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="text-[#3b82f6] flex gap-2 items-center cursor-pointer hover:text-[#1d4ed8] text-sm font-medium"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Додади превод</span>
      </button>

      {showPicker && (
        <div className="absolute top-8 left-0 z-30 bg-white shadow-lg border border-[#e5e7eb] p-3 w-72">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#374151]">Одбери јазик</span>
            <button type="button" onClick={() => setShowPicker(false)} className="text-[#6b7280] hover:text-[#374151]">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
            {available.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => { onAdd(lang.code); setShowPicker(false); }}
                className="flex items-center gap-2 px-2 py-2 text-sm text-[#374151] hover:bg-[#eff6ff] hover:text-[#2563eb] transition-colors text-left"
              >
                <FlagIcon countryCode={lang.countryCode} />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
