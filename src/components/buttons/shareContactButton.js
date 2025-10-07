'use client';
import { useState } from "react";
import { createPortal } from "react-dom";
import { shareContactMessages } from "@/lib/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import PopUp from "@/components/layout/popup";
import ShareContactForm from "@/components/forms/shareContactForm";

export default function ShareContactButton({page, user, lang = 'mk', ...props}) {
  const [showShareContactForm, setShowShareContactForm] = useState(false);
  const messages = shareContactMessages[lang];

  return (
    <>
      <div {...props}>
        <button onClick={() => setShowShareContactForm(true)}className="!cursor-pointer">
          <FontAwesomeIcon icon={faShareNodes} className="w-6 h-6 pr-2" />
          <span>{messages.buttonText}</span>
        </button>
      </div>
      {showShareContactForm && createPortal(
        <PopUp>
          <button onClick={() => setShowShareContactForm(false)} className="absolute top-2 right-3 text-lg font-bold" >
            <FontAwesomeIcon icon={faClose} className="w-5 h-5 text-2xl hover:text-[#3b82f6]" />
          </button>
          <ShareContactForm page={page} user={user} lang={lang} />
        </PopUp>,
        document.body
      )}
    </>
  );
}