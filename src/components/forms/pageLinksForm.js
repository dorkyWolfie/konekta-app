'use client';
import Image from "next/image";
import SectionBox from "../layout/sectionBox";
import SubmitButton from "../buttons/submitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faComment, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GB } from 'country-flag-icons/react/3x2';
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { upload } from "@/libs/upload";
import { toast } from "react-hot-toast";
import { savePageLinks } from "@/actions/linkActions";
import { useRouter } from 'next/navigation';

export default function PageLinksForm({page,user}) {
  const router = useRouter();
  const [links, setLinks] = useState(page.links || []);
  const [showEnglish, setShowEnglish] = useState(page.showEnglishTranslation || false);

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
        title_en: '',
        subtitle: '',
        subtitle_en: '',
        icon: '',
        url: ''
      }
    ]);
  }

  function handleUpload(ev, linkKeyForUpload) {
    upload(ev, uploadedImageUrl => {
      setLinks(prevLinks => {
        const newLinks = [...prevLinks];
        newLinks.forEach((link,index) => {
          if (link.key === linkKeyForUpload) {
            link.icon = uploadedImageUrl;
          }
        });
        return newLinks;
      });
    });
  }

  function handleLinkChange(keyOfLinkToChange, prop, ev) {
  setLinks(prev => {
    const newLinks = [...prev];
    newLinks.forEach((link) => {
      if (link.key === keyOfLinkToChange) {
        link[prop] = ev.target.value;
      }
    });
    return newLinks;
  });
}

function removeLink(linkKeyToRemove) {
  setLinks(prevLinks =>
    [...prevLinks].filter(l => l.key !== linkKeyToRemove)
  );
  toast.success('Линкот е избришан!');
}

  return (
    <SectionBox>
      <form action={save}>
        <input type="hidden" name="showEnglishTranslation" value={showEnglish} />
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
                        <Image src={l.icon} alt={'icon'} className="w-full h-full object-cover"width={50} height={50} />
                        )}
                      {!l.icon && (<FontAwesomeIcon icon={faLink} />)}
                    </div>
                    <div>
                      <input 
                        onChange={ev => handleUpload(ev,l.key)} id={'icon'+l.key} 
                        type="file" className="hidden" />
                      <label 
                        htmlFor={'icon'+l.key}
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
                    value={l.title} onChange={ev => handleLinkChange(l.key, 'title', ev)}
                    type="text" placeholder="Наслов" />
                  {showEnglish && (
                    <input
                      value={l.title_en || ''}
                      onChange={ev => handleLinkChange(l.key, 'title_en', ev)}
                      type="text" placeholder="English title"
                      className="mt-2 border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  )}
                  <label className="input-label">Поднаслов</label>
                  <input
                    value={l.subtitle} onChange={ev => handleLinkChange(l.key, 'subtitle', ev)} type="text" placeholder="Поднаслов (не е задолжително)" />
                  {showEnglish && (
                    <input
                      value={l.subtitle_en || ''}
                      onChange={ev => handleLinkChange(l.key, 'subtitle_en', ev)}
                      type="text" placeholder="English subtitle (optional)"
                      className="mt-2 border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb] bg-[#eff6ff]"
                    />
                  )}
                  <label className="input-label">Линк</label>
                  <input
                    value={l.url} onChange={ev => handleLinkChange(l.key, 'url', ev)} type="text" placeholder="https://website.com" />
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

        {/* English Translation Toggle */}
        <div className="border-t pt-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-[#374151] flex items-center gap-1"><GB className="w-4 h-3" /> Додади Англиски превод</span>
            <button
              type="button"
              onClick={() => setShowEnglish(!showEnglish)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showEnglish ? 'bg-[#2563eb]' : 'bg-[#e5e7eb]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showEnglish ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {showEnglish && (
            <p className="text-sm text-[#4b5563] mb-4 flex items-center gap-1"><GB className="w-4 h-3" /> English fields will appear below each link title and subtitle when enabled.</p>
          )}
        </div>

        <div className="max-w-[200px] mx-auto mt-4 ">
          <SubmitButton>
            <FontAwesomeIcon icon={faSave} />
            <span>Зачувај</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}