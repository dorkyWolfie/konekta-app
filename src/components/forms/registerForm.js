'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import LoadingButton from "@/components/buttons/loadingButton";

export default function RegisterForm() {
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
        toast.success('Профилот е успешно креиран! Ве молиме најавете се.');
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(data.error || 'Профилот не е креиран. Ве молиме обидете се повторно.');
      }
    } catch (error) {
      toast.error('Се појави грешка. Ве молиме обидете се повторно.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="input-div">
          <label htmlFor="name">Име</label>
          <input
            id="name" name="name" type="text"
            required disabled={isLoading} placeholder="Име"
          />
        </div>
        <div className="input-div">
          <label htmlFor="email">Е-пошта</label>
          <input
            id="email" name="email" type="email"
            required disabled={isLoading} placeholder="Е-пошта"
          />
        </div>
        <div className="input-div mb-4">
          <label htmlFor="password">Лозинка</label>
          <input
            id="password" name="password" type="password"
            required disabled={isLoading} placeholder="Лозинка"
          />
        </div>
        <LoadingButton type="submit" isLoading={isLoading} loadingText="Се креира профилот...">
          Регистрирај се
        </LoadingButton>
      </form>
    </div>
  );
}
