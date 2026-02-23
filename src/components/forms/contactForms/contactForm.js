'use client';
import LoadingButton from '@/components/buttons/loadingButton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { websiteTranslations } from '@/lib/i18n';

export default function ContactForm({ lang = 'en' }) {
  const t = websiteTranslations[lang] || websiteTranslations.en;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ ime: '', prezime: '', email: '', telefon: '', poraka: '' });

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tip: 'kontakt', ...formData }),
    });
    setSuccess(res.ok);
    if (res.ok) {
      setFormData({ ime: '', prezime: '', email: '', telefon: '', poraka: '' });
      toast.success(t.contactSuccess);
    } else {
      toast.error(t.contactError);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-6 justify-between">
          <div className="input-div w-1/2">
            <label>{t.contactFirstName}</label>
            <input name="ime" type="text" value={formData.ime} onChange={handleChange} required />
          </div>
          <div className="input-div w-1/2">
            <label>{t.contactLastName}</label>
            <input name="prezime" type="text" value={formData.prezime} onChange={handleChange} required />
          </div>
        </div>
        <div className="input-div">
          <label>{t.contactEmailLabel}</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-div">
          <label>{t.contactPhone}</label>
          <input name="telefon" type="text" value={formData.telefon} onChange={handleChange} />
        </div>
        <div className="input-div">
          <label>{t.contactMessage}</label>
          <textarea name="poraka" value={formData.poraka} onChange={handleChange} required />
        </div>
      </div>
      <LoadingButton type="submit" isLoading={loading} loadingText={t.contactSending}>{t.contactSend}</LoadingButton>
    </form>
  );
}
