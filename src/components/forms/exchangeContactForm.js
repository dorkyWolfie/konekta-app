'use client';
import SubmitButton from "@/components/buttons/submitButton";
import { page } from "@/models/page";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { saveExchangeContact } from "@/actions/contactActions";
import { getLocalizedContent, contactMessages } from "@/lib/i18n";

export default function ExchangeContactForm({page, user, lang = 'mk'}) {
  const router = useRouter();
  const messages = contactMessages[lang];
  const content = getLocalizedContent(page, lang);

  async function saveContact(formData) {
    const result = await saveExchangeContact(formData);
    if (result) {
      toast.success(messages.success);
      router.refresh();
    }
    else {
      toast.error(messages.error);
    }
  }

  return (
    <form action={saveContact}>
      <input type="hidden" name="targetPageUri" value={page?.uri} />
      <div className="flex flex-col gap-1 items-center justify-center text-center pb-5">
        <h1>{messages.h1}</h1>
        <p>{messages.description} {content?.displayName || content?.owner}</p>
      </div>
      <div className="flex flex-col gap-2 items-start justify-center">
        <div className="flex flex-row gap-8 w-full">
          <label className="input-label w-full" htmlFor="contactName">
            <span>{messages.firstName}</span>
            <input type="text" id="contactName" name="contactName" placeholder={messages.firstNamePlaceholder} required />
          </label>
          <label className="input-label w-full" htmlFor="contactLastName">
            <span>{messages.lastName}</span>
            <input type="text" id="contactLastName" name="contactLastName" placeholder={messages.lastNamePlaceholder} required />
          </label>
        </div>
        <label className="input-label w-full" htmlFor="contactCompany">
          <span>{messages.company}</span>
          <input type="text" id="contactCompany" name="contactCompany" placeholder={messages.company} />
        </label>
        <label className="input-label w-full" htmlFor="contactPosition">
          <span>{messages.position}</span>
          <input type="text" id="contactPosition" name="contactPosition" placeholder={messages.position} />
        </label>
        <label className="input-label w-full" htmlFor="contactEmail">
          <span>{messages.email}</span>
          <input type="text" id="contactEmail" name="contactEmail" placeholder={messages.emailPlaceholder} required />
        </label>
        <label className="input-label w-full" htmlFor="contactPhone">
          <span>{messages.phone}</span>
          <input type="text" id="contactPhone" name="contactPhone" placeholder={messages.phone} />
        </label>
        <div className="max-w-[200px] mx-auto mt-4">
          <SubmitButton>
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{messages.save}</span>
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}