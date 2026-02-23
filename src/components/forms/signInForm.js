'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import LoadingButton from "@/components/buttons/loadingButton";
import { websiteTranslations } from "@/lib/i18n";

export default function SignInForm({ lang = 'en' }) {
  const t = websiteTranslations[lang] || websiteTranslations.en;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: e.target.email.value,
        password: e.target.password.value,
        callbackUrl: "/account",
      });

      if (res?.ok && res?.url) {
        toast.success(t.signInSuccess);
        setTimeout(() => {
          window.location.href = res.url;
        }, 200);
      } else if (res?.error) {
        toast.error(t.signInWrongCreds);
      }
    } catch (error) {
      toast.error(t.generalError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="input-div">
          <label htmlFor="email">{t.emailLabel}</label>
          <input id="email" name="email" type="email" required disabled={isLoading} placeholder={t.emailPlaceholder} />
        </div>
        <div className="input-div pb-1">
          <label htmlFor="password">{t.passwordLabel}</label>
          <input id="password" name="password" type="password" required disabled={isLoading} placeholder={t.passwordPlaceholder} />
        </div>
        <LoadingButton type="submit" isLoading={isLoading} loadingText={t.signingIn}>
          {t.signInBtn}
        </LoadingButton>
      </form>
    </div>
  );
}
