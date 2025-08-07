'use client';
import LoadingButton from '@/components/buttons/loadingButton';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
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
      toast.success('Пораката е успешно испратена!');
    } else {
      toast.error('Се појави грешка. Ве молиме обидете се повторно.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-6 justify-between">
          <div className="input-div w-1/2">
            <label>Име*</label>
            <input name="ime" type="text" value={formData.ime} onChange={handleChange} required />
          </div>
          <div className="input-div w-1/2">
            <label>Презиме*</label>
            <input name="prezime" type="text" value={formData.prezime} onChange={handleChange} required />
          </div>
        </div>
        <div className="input-div">
          <label>E-mail*</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-div">
          <label>Телефонски број</label>
          <input name="telefon" type="text" value={formData.telefon} onChange={handleChange} />
        </div>
        <div className="input-div">
          <label>Порака</label>
          <textarea name="poraka" value={formData.poraka} onChange={handleChange} required />
        </div>
      </div>
      <LoadingButton type="submit" isLoading={loading} loadingText="Се испраќа..." >Испрати</LoadingButton>
    </form>
  );
}