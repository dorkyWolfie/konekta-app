'use client';
import Image from "next/image";
import SectionBox from "../layout/sectionBox";
import SubmitButton from "../buttons/submitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faGripLines, faPlus, faSave, faTrash, faEnvelope, faPhone, faGlobe, faUser, faComment } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faTwitter, faLinkedin, faYoutube, faTiktok, faGithub, faWhatsapp, faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { upload } from "@/libs/upload";
import { toast } from "react-hot-toast";
import { savePageButtons } from "@/actions/buttonActions";
import { useRouter } from 'next/navigation';

export const BUTTON_TYPES = {
  email: { icon: faEnvelope, label: 'Email', placeholder: 'email@example.com', type: 'email' },
  phone: { icon: faPhone, label: 'Телефон', placeholder: '+38970123456', type: 'tel' },
  whatsapp: { icon: faWhatsapp, label: 'WhatsApp', placeholder: '+38970123456', type: 'tel' },
  website: { icon: faGlobe, label: 'Website', placeholder: 'https://yourwebsite.com', type: 'url' },
  instagram: { icon: faInstagram, label: 'Instagram', placeholder: 'https://instagram.com/username', type: 'url' },
  facebook: { icon: faFacebook, label: 'Facebook', placeholder: 'https://facebook.com/username', type: 'url' },
  twitter: { icon: faTwitter, label: 'Twitter/X', placeholder: 'https://twitter.com/username', type: 'url' },
  linkedin: { icon: faLinkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', type: 'url' },
  youtube: { icon: faYoutube, label: 'YouTube', placeholder: 'https://youtube.com/channel/...', type: 'url' },
  tiktok: { icon: faTiktok, label: 'TikTok', placeholder: 'https://tiktok.com/@username', type: 'url' },
  github: { icon: faGithub, label: 'GitHub', placeholder: 'https://github.com/username', type: 'url' },
  discord: { icon: faDiscord, label: 'Discord', placeholder: 'https://discordapp.com/users/user или @username', type: 'text' },
  telegram: { icon: faTelegram, label: 'Telegram', placeholder: 'https://t.me/username или @username', type: 'text' },
  custom: { icon: faUser, label: 'Внеси ново', placeholder: 'https://example.com', type: 'url' }
};

export default function PageButtonsForm({ page, user }) {
  const router = useRouter();
  // Initialize buttons - handle both legacy object format and new array format
  const initializeButtons = () => {
    // Check if page.buttons is an array (new format)
    if (Array.isArray(page.buttons)) {
      return page.buttons.map(button => ({
        key: button.key || `${button.type}_${Date.now()}`,
        type: button.type || 'custom',
        title: button.title || BUTTON_TYPES[button.type]?.label || button.type,
        value: button.value || '',
        icon: button.icon || '',
        isActive: button.isActive !== undefined ? button.isActive : true,
        isCustom: button.isCustom !== undefined ? button.isCustom : !BUTTON_TYPES[button.type]
      }));
    }
    // Handle legacy object format
    else if (page.buttons && typeof page.buttons === 'object') {
      return Object.entries(page.buttons)
        .filter(([key, value]) => value && value.trim() !== '')
        .map(([key, value]) => ({
          key: `${key}_${Date.now()}`,
          type: key,
          title: BUTTON_TYPES[key]?.label || key,
          value: value,
          icon: '',
          isActive: true,
          isCustom: !BUTTON_TYPES[key]
        }));
    }
    return [];
  };

  const [buttons, setButtons] = useState(initializeButtons);
  const [showAddMenu, setShowAddMenu] = useState(false);

  async function save() {
    try {
      // Send the array directly to the backend function
      const result = await savePageButtons(buttons);
      
      if (result.success) {
        toast.success('Зачувано!');
      } else {
        toast.error(result.error || 'Грешка при зачувување!');
      }
    } catch (error) {
      console.error('Error saving buttons:', error);
      toast.error('Грешка при зачувување!');
    } finally {
      router.refresh();
    }
  }

  function addNewButton(buttonType) {
    if (buttonType === 'custom') {
      // For custom buttons, generate a unique type
      const customType = `custom_${Date.now()}`;
      setButtons(prev => [
        ...prev,
        {
          key: customType,
          type: customType,
          title: 'Ново копче',
          value: '',
          icon: '',
          isActive: true,
          isCustom: true
        }
      ]);
    } else {
      const existingButton = buttons.find(b => b.type === buttonType && b.isActive);
      if (existingButton) {
        toast.error(`${BUTTON_TYPES[buttonType].label} веќе постои!`);
        return;
      }

      setButtons(prev => [
        ...prev,
        {
          key: `${buttonType}_${Date.now()}`,
          type: buttonType,
          title: BUTTON_TYPES[buttonType].label,
          value: '',
          icon: '',
          isActive: true,
          isCustom: false
        }
      ]);
    }
    setShowAddMenu(false);
  }

  function handleUpload(ev, buttonKeyForUpload) {
    upload(ev, uploadedImageUrl => {
      setButtons(prevButtons => {
        return prevButtons.map(button => 
          button.key === buttonKeyForUpload 
            ? { ...button, icon: uploadedImageUrl }
            : button
        );
      });
    });
  }

  function handleButtonChange(keyOfButtonToChange, prop, value) {
    setButtons(prev => {
      return prev.map(button => 
        button.key === keyOfButtonToChange 
          ? { ...button, [prop]: value }
          : button
      );
    });
  }

  function removeButton(buttonKeyToRemove) {
    setButtons(prevButtons =>
      prevButtons.filter(b => b.key !== buttonKeyToRemove)
    );
    toast.success('Копчето е избришано!');
  }

  function toggleButton(buttonKey) {
    setButtons(prev =>
      prev.map(button =>
        button.key === buttonKey
          ? { ...button, isActive: !button.isActive }
          : button
      )
    );
  }

  // Get available button types that haven't been added yet (excluding custom)
  const availableButtonTypes = Object.keys(BUTTON_TYPES).filter(type => {
    if (type === 'custom') return true; // Custom is always available
    return !buttons.some(button => button.type === type && button.isActive);
  });

  return (
    <SectionBox>
      <form action={save}>
        <h2 className="text-2xl font-bold mb-4">Контакт</h2>
        <div className="mb-4">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)} 
            type="button" 
            className="text-[#3b82f6] text-lg flex gap-2 items-center cursor-pointer hover:text-[#1d4ed8]">
            <FontAwesomeIcon icon={faPlus} />
            <span>Внеси ново копче</span>
          </button>
          {showAddMenu && availableButtonTypes.length > 0 && (
            <div className="mt-2 p-4 bg-[#f3f4f6]">
              <p className="text-sm text-[#4b5563] mb-2">Избери тип на копче:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableButtonTypes.map(type => (
                  <button
                    key={type} type="button" onClick={() => addNewButton(type)}
                    className="flex items-center gap-2 p-2 text-sm border-b border-[#d1d5db] hover:bg-white hover:text-[#3b82f6] transition-colors">
                    <FontAwesomeIcon icon={BUTTON_TYPES[type].icon} />
                    <span>{BUTTON_TYPES[type].label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {availableButtonTypes.length === 0 && showAddMenu && (
            <div className="mt-2 p-4 bg-[#f8fafc] border text-center text-[#64748b]">
              Сите достапни копчиња се додадени!
            </div>
          )}
        </div>
        <div className="w-full">
          <ReactSortable handle=".handle" list={buttons} setList={setButtons}>
            {buttons.map(button => (
              <div key={button.key} className={`w-full flex gap-2 items-center justify-center ${button.isActive ? 'bg-white' : 'bg-[#f1f5f9] opacity-75'}`}>
                <div className="w-full grow mt-8 flex flex-col gap-4 items-center md:flex-row justify-center">
                  <div className="flex gap-2 items-center">
                    <div className="handle py-2 cursor-grab"><FontAwesomeIcon icon={faGripLines} className="text-[#6b7280] hover:text-[#60a5fa]" /></div>
                    {/* left side icon and delete */}
                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                      <div className="w-12 h-12 flex items-center justify-center">
                        {button.icon ? (
                          <Image src={button.icon} alt={'icon'} className="w-full h-full object-cover" width={48} height={48} />
                        ) : (
                          <FontAwesomeIcon icon={button.isCustom ? faUser : (BUTTON_TYPES[button.type]?.icon || faUser)} className="text-[#94a3b8]  " />
                        )}
                      </div>
                      {/* icon and delete */}
                      <div className="text-center">
                        <input 
                          onChange={ev => handleUpload(ev, button.key)} 
                          id={'icon' + button.key} type="file" className="hidden" accept="image/*"
                        />
                        <label 
                          htmlFor={'icon' + button.key}
                          className="text-sm py-2 px-6 flex items-center gap-1 border border-[#e5e7eb] hover:text-[#2563eb] cursor-pointer">
                          <FontAwesomeIcon icon={faCloudArrowUp} />
                          <span>Промени икона</span>
                        </label>
                        <button 
                          type="button" onClick={() => removeButton(button.key)}
                          className="text-sm p-2 px-4 flex items-center gap-1 text-[#ef4444] cursor-pointer hover:text-[#b91c1c]">
                          <FontAwesomeIcon icon={faTrash} />
                          <span>Избриши го линкот</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* toggle */}
                  <div className="flex-1 grow w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={button.isCustom ? faUser : (BUTTON_TYPES[button.type]?.icon || faUser)} className="text-[#6b7280]"
                      />
                      <h3 className="font-semibold text-[#374151]">{button.title}</h3>
                      {/* <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={button.isActive}
                          onChange={() => toggleButton(button.key)}
                          className="rounded"
                        />
                        <span className="text-gray-600">Активно</span>
                      </label> */}
                    </div>
                    {/* inputs for all buttons div */}
                    <div className="space-y-2">
                      {button.isCustom && (
                        <div>
                          <label className="block text-sm text-[#4b5563] mb-1">Тип на копче</label>
                          <input 
                            value={button.type.replace('custom_', '')} 
                            onChange={ev => handleButtonChange(button.key, 'type', `custom_${ev.target.value.replace(/\s+/g, '_').toLowerCase()}`)} 
                            type="text" placeholder="На пр: portfolio, blog, shop..."
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm text-[#4b5563] mb-1">Наслов (за приказ)</label>
                        <input 
                          value={button.title} 
                          onChange={ev => handleButtonChange(button.key, 'title', ev.target.value)} 
                          type="text" placeholder="Наслов на копчето"
                        />
                      </div>
                      {/* url input */}
                      <div>
                        <label className="block text-sm text-[#4b5563] mb-1">
                          {button.type === 'email' ? 'Email адреса' : 
                           button.type === 'phone' ? 'Телефонски број' :
                           button.type === 'whatsapp' ? 'WhatsApp број' :
                           button.type === 'discord' ? 'Discord линк или корисничко име' :
                           button.type === 'telegram' ? 'Telegram линк или корисничко име' :
                           button.isCustom ? 'Линк или вредност' :
                           'URL адреса'}
                        </label>
                        <input 
                          value={button.value} 
                          onChange={ev => handleButtonChange(button.key, 'value', ev.target.value)} 
                          type={button.isCustom ? 'text' : (BUTTON_TYPES[button.type]?.type || 'text')}
                          placeholder={button.isCustom ? 'https://example.com' : (BUTTON_TYPES[button.type]?.placeholder || 'Внеси вредност')}
                          className="border-b border-[#e5e7eb] w-full block py-2 px-2 mb-2 hover:border-b hover:border-[#2563eb]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        {buttons.length === 0 && (
          <div className="text-center py-8 text-[#6b7280]">
            <FontAwesomeIcon icon={faComment} size="2x" className="mb-2" />
            <p>Немате додадено копчиња. Кликнете на &quot;Внеси ново копче&quot; за да започнете.</p>
          </div>
        )}
        <div className="max-w-[200px] mx-auto mt-6">
          <SubmitButton>
            <FontAwesomeIcon icon={faSave} />
            <span>Зачувај</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}