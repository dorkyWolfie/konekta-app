'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import LoadingButton from "@/components/buttons/loadingButton";
import { websiteTranslations } from "@/lib/i18n";

export default function RegisterForm({ lang = 'en' }) {
  const t = websiteTranslations[lang] || websiteTranslations.en;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t.registerSuccess);
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        toast.error(data.error || t.registerError);
      }
    } catch (error) {
      toast.error(t.generalError);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="input-div">
          <label htmlFor="name">{t.nameLabel}</label>
          <input id="name" name="name" type="text" required disabled={isLoading} placeholder={t.namePlaceholder} />
        </div>
        <div className="input-div">
          <label htmlFor="email">{t.emailLabel}</label>
          <input id="email" name="email" type="email" required disabled={isLoading} placeholder={t.emailPlaceholder} />
        </div>
        <div className="input-div mb-4">
          <label htmlFor="password">{t.passwordLabel}</label>
          <input id="password" name="password" type="password" required disabled={isLoading} placeholder={t.passwordPlaceholder} />
        </div>
        <LoadingButton type="submit" isLoading={isLoading} loadingText={t.registering}>
          {t.registerBtn}
        </LoadingButton>
      </form>
    </div>
  );
}
