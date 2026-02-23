'use client';
import Image from "next/image";
import SectionBox from "../layout/sectionBox";
import SubmitButton from "../buttons/submitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faComment, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import FlagIcon from "@/components/FlagIcon";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { upload } from "@/libs/upload";
import { toast } from "react-hot-toast";
import { savePageLinks } from "@/actions/linkActions";
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export default function PageLinksForm({page, user}) {
  const router = useRouter();
  const [links, setLinks] = useState(page.links || []);
  const primaryLang = page.primaryLanguage || 'mk';
  // Non-primary languages only — primary content is in the main title/subtitle inputs
  const enabledLanguages = (
    page.enabledLanguages?.length > 0
      ? page.enabledLanguages
      : page.showEnglishTranslation ? ['mk', 'en'] : ['mk']
  ).filter(l => l !== primaryLang);

  async function save(formData) {
    try {
      const result = await savePageLinks(links, formData);
      if (result.success) {
        toast.success('Зачувано!');
        router.refresh();
      } else {
        toast.error('Грешка при зачувување!');
      }
    } catch (error) {
      toast.error('Грешка при зачувување!');
    }
  }

  function addNewLink() {
    setLinks(prev => [
      ...prev,
      {
        key: Date.now().toString(),
        title: '',
        subtitle: '',
        icon: '',
        url: '',
        translations: {}
      }
    ]);
  }

  function handleUpload(ev, linkKeyForUpload) {
    upload(ev, uploadedImageUrl => {
      setLinks(prevLinks => {
        const newLinks = [...prevLinks];
        newLinks.forEach(link => {
          if (link.key === linkKeyForUpload) link.icon = uploadedImageUrl;
        });
        return newLinks;
      });
    });
  }

  function handleLinkChange(keyOfLinkToChange, prop, value, langCode = null) {
    setLinks(prev => prev.map(link => {
      if (link.key !== keyOfLinkToChange) return link;
      if (!langCode) {
        return { ...link, [prop]: value };
      }
      const translations = { ...(link.translations || {}) };
      translations[langCode] = { ...(translations[langCode] || {}), [prop]: value };
      return { ...link, translations };
    }));
  }

  function removeLink(linkKeyToRemove) {
    setLinks(prevLinks => [...prevLinks].filter(l => l.key !== linkKeyToRemove));
    toast.success('Линкот е избришан!');
  }

  return (
    <SectionBox>
      <form action={save}>
        <h2 className="text-2xl font-bold mb-4">Линкови</h2>
        <button
          onClick={addNewLink} type="button"
          className="text-[#3b82f6] text-lg flex gap-2 items-center cursor-pointer hover:text-[#1d4ed8]">
          <FontAwesomeIcon icon={faPlus} />
          <span>Внеси нов линк</span>
        </button>
        <div>
          <ReactSortable handle=".handle" list={links} setList={setLinks}>
            {links.map(l => (
              <div key={l.key} className="mt-8 flex gap-4 items-center sm:flex-nowrap flex-wrap justify-center">
                <div className="mt-8 flex gap-2 items-center">
                  <div className="handle py-2 cursor-grab">
                    <FontAwesomeIcon icon={faGripLines} className="text-[#6b7280] hover:text-[#60a5fa]" />
                  </div>
                  <div className="text-center flex flex-col items-center gap-2 text-sm">
                    <div className="aspect-square max-w-[50px]">
                      {l.icon && (
                        <Image src={l.icon} alt={'icon'} className="w-full h-full object-cover" width={50} height={50} />
                      )}
                      {!l.icon && (<FontAwesomeIcon icon={faLink} />)}
                    </div>
                    <div>
                      <input
                        onChange={ev => handleUpload(ev, l.key)} id={'icon' + l.key}
                        type="file" className="hidden" />
                      <label
                        htmlFor={'icon' + l.key}
                        className="py-2 px-6 flex items-center gap-1 border border-[#e5e7eb] hover:text-[#2563eb] cursor-pointer">
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        <span>Промени икона</span>
                      </label>
                    </div>
                    <button
                      type="button" onClick={() => removeLink(l.key)}
                      className="p-2 px-4 flex items-center gap-1 text-[#ef4444] cursor-pointer hover:text-[#b91c1c]">
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Избриши го линкот</span>
                    </button>
                  </div>
                </div>
                <div className="grow">
                  <label className="input-label">Наслов</label>
                  <input
                    value={l.title} onChange={ev => handleLinkChange(l.key, 'title', ev.target.value)}
                    type="text" placeholder="Наслов" />

                  {/* Translation title inputs — all non-primary languages use translations[langCode] */}
                  {enabledLanguages.map(langCode => {
                    const langInfo = SUPPORTED_LANGUAGES.find(sl => sl.code === langCode);
                    if (!langInfo) return null;
                    return (
                      <input
                        key={langCode}
                        value={l.translations?.[langCode]?.title || ''}
                        onChange={ev => handleLinkChange(l.key, 'title', ev.target.value, langCode)}
                        type="text"
                        placeholder={`Наслов (${langInfo.name})`}
                        className="mt-1 border-b border-[#e5e7eb] w-full block py-2 px-2 mb-1 hover:border-b hover:border-[#2563eb] bg-[#eff6ff] flex items-center gap-1"
                        style={{ backgroundImage: 'none' }}
                      />
                    );
                  })}

                  <label className="input-label">Поднаслов</label>
                  <input
                    value={l.subtitle} onChange={ev => handleLinkChange(l.key, 'subtitle', ev.target.value)}
                    type="text" placeholder="Поднаслов (не е задолжително)" />

                  {/* Translation subtitle inputs — all non-primary languages use translations[langCode] */}
                  {enabledLanguages.map(langCode => {
                    const langInfo = SUPPORTED_LANGUAGES.find(sl => sl.code === langCode);
                    if (!langInfo) return null;
                    return (
                      <input
                        key={langCode}
                        value={l.translations?.[langCode]?.subtitle || ''}
                        onChange={ev => handleLinkChange(l.key, 'subtitle', ev.target.value, langCode)}
                        type="text"
                        placeholder={`Поднаслов (${langInfo.name})`}
                        className="mt-1 border-b border-[#e5e7eb] w-full block py-2 px-2 mb-1 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                      />
                    );
                  })}

                  <label className="input-label">Линк</label>
                  <input
                    value={l.url} onChange={ev => handleLinkChange(l.key, 'url', ev.target.value)}
                    type="text" placeholder="https://website.com" />
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        {links.length === 0 && (
          <div className="text-center py-8 text-[#6b7280]">
            <FontAwesomeIcon icon={faComment} size="2x" className="mb-2" />
            <p>Немате додадено линкови. Кликнете на &quot;Внеси нов линк&quot; за да започнете.</p>
          </div>
        )}

        {enabledLanguages.length > 0 && (
          <div className="border-t pt-3 mt-4">
            <p className="text-sm text-[#6b7280] flex flex-wrap gap-2 items-center">
              <span>Активни преводи:</span>
              {enabledLanguages.map(code => {
                const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === code);
                return langInfo ? (
                  <span key={code} className="flex items-center gap-1 bg-[#eff6ff] px-2 py-0.5 text-xs text-[#1e3a8a]">
                    <FlagIcon countryCode={langInfo.countryCode} className="w-3 h-2" />
                    {langInfo.name}
                  </span>
                ) : null;
              })}
              <span className="text-[#9ca3af]">— за промена на јазиците, одете во Основни поставки.</span>
            </p>
          </div>
        )}

        <div className="max-w-[200px] mx-auto mt-4">
          <SubmitButton>
            <FontAwesomeIcon icon={faSave} />
            <span>Зачувај</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}
