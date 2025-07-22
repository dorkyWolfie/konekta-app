'use client';
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import LoadingButton from "@/components/buttons/loadingButton";

export default function SignInForm() {
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
        toast.success('Успешно се најавивте!');
        // Small delay to show success message before redirect
        setTimeout(() => {
          window.location.href = res.url;
        }, 1500);
      } else if (res?.error) {
 
        toast.error('Погрешна е-пошта или лозинка.');
      }
    } catch (error) {
      // console.error('Sign in error:', error);
      toast.error('Се појави грешка. Ве молиме обидете се повторно.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="input-div">
          <label htmlFor="email">Е-пошта</label>
          <input
            id="email" name="email" type="email"
            required disabled={isLoading} placeholder="Е-пошта"
          />
        </div>
        <div className="input-div">
          <label htmlFor="password">Лозинка</label>
          <input
            id="password" name="password" type="password" 
            required disabled={isLoading} placeholder="Лозинка"
          />
        </div>
        <LoadingButton type="submit" isLoading={isLoading} loadingText="Ве најавува..." >Најави се</LoadingButton>
      </form>
    </div>
  );
}
