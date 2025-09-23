'use client';
import grabUsername from "@/actions/grabUsername";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsernameForm({desiredUsername}) {
  const [taken,setTaken] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const result = await grabUsername(formData);
  if (result === false) {
    setTaken(true);
  } else {
    setTaken(false);
    router.push('/account?created='+formData.get('username'));
  }
}

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold text-center mb-2">Одбери корисничко име!</h1>
      {/* <h1 className="text-4xl font-bold text-center mb-2">Потврди го твоето корисничко име!</h1> */}
      {/* <p className="text-center mb-6 text-[#6b7280]">Одбери корисничко име.</p> */}
      <div className="max-w-xs mx-auto">
        <input 
          name="username"
          className="block p-2 mx-auto text-center border w-full mb-2" 
          defaultValue={desiredUsername}
          type="text" placeholder="username / корисничко име" />
        {taken && (
          <div className="bg-[#fecaca] border border-[#ef4444] p-2 mb-2 text-center">
            Ова корисничко име е зафатено.
          </div>
        )}
        <button type="submit" className="bg-[#3b82f6] text-white py-2 px-4 block mx-auto w-full border-2 hover:bg-transparent hover:text-[#2563eb] hover:border-2 border-[#3b82f6]">Зачувај</button>
      </div>
    </form>
  )
}