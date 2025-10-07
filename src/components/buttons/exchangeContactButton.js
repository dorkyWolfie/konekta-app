'use client';
import { useState } from "react";
import { createPortal } from "react-dom";
import { contactMessages } from "@/lib/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRepeat } from "@fortawesome/free-solid-svg-icons";
import PopUp from "@/components/layout/popup";
import ExchangeContactForm from "@/components/forms/exchangeContactForm";

export default function ExchangeContactButton({page, user, lang = 'mk', ...props}) {
  const [showExchangeContactForm, setShowExchangeContactForm] = useState(false);
  const messages = contactMessages[lang];

  return (
    <>
      <div {...props}>
        <button onClick={() => setShowExchangeContactForm(true)}className="!cursor-pointer">
          <FontAwesomeIcon icon={faRepeat} className="w-6 h-6 pr-2" />
          <span>{messages.buttonText}</span>
        </button>
      </div>
      {showExchangeContactForm && createPortal(
        <PopUp>
          <button onClick={() => setShowExchangeContactForm(false)} className="!cursor-pointer">
            <FontAwesomeIcon icon={faClose} className="w-5 h-5 text-2xl hover:text-[#3b82f6]" />
          </button>
          <ExchangeContactForm page={page} user={user} lang={lang} />
        </PopUp>,
        document.body
      )}
    </>
  );
}