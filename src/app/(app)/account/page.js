'use server';
import mongoose from "mongoose";
import UsernameForm from "@/components/forms/UsernameForm";
import PageSettingsForm from "@/components/forms/pageSettingsForm";
import PageButtonsForm from "@/components/forms/pageButtonsForm";
import PageLinksForm from "@/components/forms/pageLinksForm";
import SectionBox from "@/components/layout/sectionBox";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { page } from "@/models/page";
import { user } from "@/models/user";
import PageFilesForm from "@/components/forms/pageFilesForm";

export default async function AccountPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const desiredUsername = resolvedSearchParams?.desiredUsername;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  mongoose.connect(process.env.MONGO_URI);
  const User = await user.findOne({ email: session?.user?.email }).lean();
  const Page = await page.findOne({owner: session?.user?.email});

  if (!Page) {
    return (
      <SectionBox>
        <UsernameForm desiredUsername={desiredUsername} />
        <p className="max-w-lg mx-auto mt-4 p-4 bg-red-50 border-2 border-red-400">Корисничкото име мора да биде на латиница и не треба да содржи празно место и знаци. <br />Може да се користат бројки. <br />Пр. ime_prezime, ime-prezime, imePrezime, ime123 </p>
      </SectionBox>
    );
  }

  // Page exists, check subscription status
  const isPro = User?.subscriptionStatus === "pro";
  const plainPage = JSON.parse(JSON.stringify(Page));

  return (
    <>
      {isPro ? (
        <>
          <PageSettingsForm page={plainPage} user={session.user} />
          <PageButtonsForm page={plainPage} user={session.user} />
          <PageLinksForm page={plainPage} user={session.user} />
          <PageFilesForm page={plainPage} user={session.user} />
        </>
      ) : (
        <SectionBox>
          <h2>Немате активен профил</h2>
          <p>Доколку сакате да го активирате профилот <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">кликнете тука</Link></p>
        </SectionBox>
      )}
    </>
  );
}