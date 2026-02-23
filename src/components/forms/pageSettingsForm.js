'use client';
import RadioTogglers from "@/components/formItems/radioTogglers";
import Image from "next/image";
import SubmitButton from "@/components/buttons/submitButton";
import SectionBox from "@/components/layout/sectionBox";
import { savePageSettings } from "@/actions/pageActions";
import { useState, useEffect } from "react";
import { upload } from "@/libs/upload";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrush, faCloudArrowUp, faArrowRight, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import FlagIcon from "@/components/FlagIcon";
import LanguagePickerButton from "@/components/forms/LanguagePickerButton";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

function getSafeImageSrc(src) {
  if (typeof src !== "string")
    return "/user-astronaut-solid-full.webp";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return "/user-astronaut-solid-full.webp";
}

// Initialize enabled languages with backward compat (excludes primary — handled separately)
function initEnabledLanguages(page, primaryLang) {
  const langs = page.enabledLanguages?.length > 0
    ? [...page.enabledLanguages]
    : page.showEnglishTranslation ? ['en'] : [];
  return langs.filter(l => l !== primaryLang);
}

export default function PageSettingsForm({page, user}) {
  const router = useRouter();
  const [bgType, setBgType] = useState(page.bgType);
  const [bgColor, setBgColor] = useState(page.bgColor);
  const [bgColorPage, setBgColorPage] = useState(page.bgColorPage);
  const [bgImage, setBgImage] = useState(page.bgImage);
  const [avatar, setAvatar] = useState(user?.image);
  const initPrimaryLang = page.primaryLanguage || 'mk';
  const [primaryLanguage, setPrimaryLanguage] = useState(initPrimaryLang);
  const [enabledLanguages, setEnabledLanguages] = useState(() => initEnabledLanguages(page, initPrimaryLang));
  // translations state: all non-primary language content { en: {...}, de: {...}, ... }
  const [translations, setTranslations] = useState(() => {
    const existing = page.translations && typeof page.translations === 'object' ? { ...page.translations } : {};
    // If EN not yet in translations but legacy _en fields exist, populate from them
    if (!existing.en || !Object.values(existing.en).some(v => v)) {
      if (page.displayName_en || page.company_en || page.position_en || page.location_en || page.bio_en) {
        existing.en = {
          displayName: page.displayName_en || '',
          company: page.company_en || '',
          position: page.position_en || '',
          location: page.location_en || '',
          bio: page.bio_en || '',
        };
      }
    }
    // Don't include primary language in this state — flat fields handle it
    delete existing[initPrimaryLang];
    return existing;
  });

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.background = bgColorPage;
    }
  }, [bgColorPage]);

  function addLanguage(code) {
    if (!enabledLanguages.includes(code)) {
      setEnabledLanguages(prev => [...prev, code]);
    }
  }

  function removeLanguage(code) {
    setEnabledLanguages(prev => prev.filter(c => c !== code));
    setTranslations(prev => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }

  function handleTranslationChange(langCode, field, value) {
    setTranslations(prev => ({
      ...prev,
      [langCode]: { ...(prev[langCode] || {}), [field]: value }
    }));
  }

  async function saveBaseSettings(formData) {
    const result = await savePageSettings(formData);
    if (result) {
      toast.success('Зачувано!');
      router.refresh();
    } else {
      toast.error('Грешка при зачувување!');
    }
  }

  async function handleCoverImageChange(ev){
    await upload(ev, link => { setBgImage(link); });
  }

  async function handleAvatarImageChange(ev){
    await upload(ev, link => { setAvatar(link); });
  }

  const showEN = enabledLanguages.includes('en');

  return (
    <div>
      <SectionBox>
        <form action={saveBaseSettings}>
          {/* Hidden fields for multi-language state */}
          <input type="hidden" name="primaryLanguage" value={primaryLanguage} />
          <input type="hidden" name="enabledLanguages" value={JSON.stringify([primaryLanguage, ...enabledLanguages])} />
          <input type="hidden" name="translations" value={JSON.stringify(translations)} />
          <input type="hidden" name="showEnglishTranslation" value={showEN} />

          <div
            className="-m-4 bg-[#d1d5db] min-h-[300px] flex items-center justify-center bg-cover bg-center"
            style={
              bgType === 'color'
                ? {backgroundColor: bgColor}
                : {backgroundImage: `url(${bgImage})`}
            }>
            <div className="flex flex-col items-center m-2">
              <RadioTogglers
                defaultValue={page.bgType}
                options={[
                  {value: 'color', icon: faBrush, label: 'Боја'},
                  {value: 'image', icon: faImage, label: 'Фотографија'}
                ]}
                onChange={val => setBgType(val)}
              />
              {bgType === 'color' && (
                <div className="bg-[#f3f4f6] shadow text-[#374151] p-2 mt-2">
                  <div className="flex gap-2 justify-center hover:text-[#2563eb]">
                    <span>Одбери боја за насловна</span>
                    <FontAwesomeIcon icon={faArrowRight} className="self-center" />
                    <input
                      type="color" name="bgColor"
                      onChange={ev => setBgColor(ev.target.value)}
                      defaultValue={page.bgColor} className="cursor-pointer" />
                  </div>
                </div>
              )}
              {bgType === 'image' && (
                <div className="flex justify-center">
                  <label className="bg-white shadow px-4 py-2 mt-2 flex gap-2 items-center cursor-pointer hover:text-[#2563eb]">
                    <input type="hidden" name="bgImage" value={bgImage} />
                    <input type="file" onChange={handleCoverImageChange} className="hidden" />
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    <span>Промени фотографија</span>
                  </label>
                </div>
              )}
              <div className="bg-[#f3f4f6] shadow text-[#374151] p-2 mt-2">
                <div className="flex gap-2 justify-center hover:text-[#2563eb]">
                  <span>Одбери боја за позадината</span>
                  <FontAwesomeIcon icon={faArrowRight} className="self-center" />
                  <input
                    type="color" name="bgColorPage"
                    onChange={ev => setBgColorPage(ev.target.value)}
                    defaultValue={page.bgColorPage} className="cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center -mb-10">
            <div className="relative -top-8">
              <Image
                className="rounded-full bg-white border-4 border-white shadow shadow-black/50 aspect-square object-cover"
                src={getSafeImageSrc(avatar)} alt={'avatar'} width={128} height={128} />
              <label
                htmlFor="avatarIn"
                className="cursor-pointer absolute -bottom-0 -right-2 bg-white p-2 rounded-full shadow shadow-black/50 aspect-square flex items-center justify-center hover:text-[#3b82f6]">
                <FontAwesomeIcon size="lg" icon={faCloudArrowUp} />
              </label>
              <input onChange={handleAvatarImageChange} id="avatarIn" type="file" className="hidden" />
              <input type="hidden" name="avatar" value={avatar || 'avatar'} />
            </div>
          </div>

          {/* Primary language selector */}
          <div className="mt-6 mb-2 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-[#374151]">Примарен јазик на профилот:</span>
            <select
              value={primaryLanguage}
              onChange={e => setPrimaryLanguage(e.target.value)}
              className="border border-[#d1d5db] px-2 py-1 text-sm bg-white hover:border-[#2563eb]"
            >
              <option value="mk">Македонски (MK)</option>
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name} ({lang.code.toUpperCase()})</option>
              ))}
            </select>
          </div>

          {/* Primary language fields */}
          <div>
            <label className="input-label" htmlFor="nameIn">Име и презиме</label>
            <input type="text" id="nameIn" name="displayName" defaultValue={page.translations?.[initPrimaryLang]?.displayName || page.displayName} placeholder="Име и презиме" />
            <label className="input-label" htmlFor="companyIn">Име на фирма</label>
            <input type="text" id="companyIn" name="company" defaultValue={page.translations?.[initPrimaryLang]?.company || page.company} placeholder="Каде работиш?" />
            <label className="input-label" htmlFor="positionIn">Позиција</label>
            <input type="text" id="positionIn" name="position" defaultValue={page.translations?.[initPrimaryLang]?.position || page.position} placeholder="На која позиција работиш?" />
            <label className="input-label" htmlFor="locationIn">Локација</label>
            <input type="text" id="locationIn" name="location" defaultValue={page.translations?.[initPrimaryLang]?.location || page.location} placeholder="Од каде си? / Каде живееш?" />
            <label className="input-label" htmlFor="bioIn">Кратка биографија</label>
            <textarea name="bio" id="bioIn" defaultValue={page.translations?.[initPrimaryLang]?.bio || page.bio} placeholder="Накратко опиши се себеси." />
          </div>

          {/* Translations section */}
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-[#374151]">Преводи</span>
              <LanguagePickerButton enabledLanguages={enabledLanguages} primaryLanguage={primaryLanguage} onAdd={addLanguage} />
            </div>

            {enabledLanguages.length === 0 && (
              <p className="text-sm text-[#9ca3af]">Нема додадени преводи. Кликнете &quot;Додади превод&quot; за да додадете јазик.</p>
            )}

            {/* EN translation section (uses translations.en — same as all other languages) */}
            {showEN && (() => {
              const enTrans = translations['en'] || {};
              return (
                <TranslationSection
                  countryCode="GB"
                  langName="English"
                  onRemove={() => removeLanguage('en')}
                >
                  <div>
                    <label className="input-label">Name</label>
                    <input
                      type="text"
                      value={enTrans.displayName || ''}
                      onChange={e => handleTranslationChange('en', 'displayName', e.target.value)}
                      placeholder="Full name"
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Company</label>
                    <input
                      type="text"
                      value={enTrans.company || ''}
                      onChange={e => handleTranslationChange('en', 'company', e.target.value)}
                      placeholder="Where do you work?"
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Position</label>
                    <input
                      type="text"
                      value={enTrans.position || ''}
                      onChange={e => handleTranslationChange('en', 'position', e.target.value)}
                      placeholder="Your job title"
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Location</label>
                    <input
                      type="text"
                      value={enTrans.location || ''}
                      onChange={e => handleTranslationChange('en', 'location', e.target.value)}
                      placeholder="Where are you from?"
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Bio</label>
                    <textarea
                      value={enTrans.bio || ''}
                      onChange={e => handleTranslationChange('en', 'bio', e.target.value)}
                      placeholder="Brief description about yourself."
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                </TranslationSection>
              );
            })()}

            {/* Other language translation sections */}
            {enabledLanguages.filter(c => c !== 'en').map(langCode => {
              const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
              if (!langInfo) return null;
              const trans = translations[langCode] || {};
              return (
                <TranslationSection
                  key={langCode}
                  countryCode={langInfo.countryCode}
                  langName={langInfo.name}
                  onRemove={() => removeLanguage(langCode)}
                >
                  <div>
                    <label className="input-label">Име и презиме</label>
                    <input
                      type="text"
                      value={trans.displayName || ''}
                      onChange={e => handleTranslationChange(langCode, 'displayName', e.target.value)}
                      placeholder={`Ime (${langInfo.name})`}
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Фирма</label>
                    <input
                      type="text"
                      value={trans.company || ''}
                      onChange={e => handleTranslationChange(langCode, 'company', e.target.value)}
                      placeholder={`Company (${langInfo.name})`}
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Позиција</label>
                    <input
                      type="text"
                      value={trans.position || ''}
                      onChange={e => handleTranslationChange(langCode, 'position', e.target.value)}
                      placeholder={`Position (${langInfo.name})`}
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Локација</label>
                    <input
                      type="text"
                      value={trans.location || ''}
                      onChange={e => handleTranslationChange(langCode, 'location', e.target.value)}
                      placeholder={`Location (${langInfo.name})`}
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                  <div>
                    <label className="input-label">Биографија</label>
                    <textarea
                      value={trans.bio || ''}
                      onChange={e => handleTranslationChange(langCode, 'bio', e.target.value)}
                      placeholder={`Bio (${langInfo.name})`}
                      className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  </div>
                </TranslationSection>
              );
            })}
          </div>

          <div className="max-w-[200px] mx-auto mt-4">
            <SubmitButton>
              <FontAwesomeIcon icon={faSave} />
              <span>Зачувај</span>
            </SubmitButton>
          </div>
        </form>
      </SectionBox>
    </div>
  );
}

function TranslationSection({ countryCode, langName, onRemove, children }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="mb-4 border border-[#dbeafe] bg-[#eff6ff]">
      <div className="flex items-center justify-between px-4 py-2 cursor-pointer select-none" onClick={() => setExpanded(v => !v)}>
        <span className="font-medium text-[#1e3a8a] flex items-center gap-2">
          <FlagIcon countryCode={countryCode} />
          {langName}
          <span className="text-xs text-[#6b7280] ml-1">{expanded ? '▲' : '▼'}</span>
        </span>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="text-[#6b7280] hover:text-[#ef4444] transition-colors"
          title={`Remove ${langName}`}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
