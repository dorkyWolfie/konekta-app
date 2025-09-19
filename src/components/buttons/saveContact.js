'use client';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SaveContact({ uri, lang = 'mk', className='' }) {
  const downloadVCard = async () => {
    const queryParams = new URLSearchParams({ uri });
    if (lang) {
      queryParams.append('lang', lang);
    }

    const res = await fetch(`/api/vcard?${queryParams.toString()}`);

    if (!res.ok) {
      alert('Failed to download contact');
      return;
    }

    const link = document.createElement('a');
    link.href = `/api/vcard?${queryParams.toString()}`;
    link.download = `${uri}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={downloadVCard} className={className}>
      <FontAwesomeIcon icon={faSave} className="w-6 h-6 pr-2" />
      <span>Превземи контакт</span>
    </button>
  );
}
