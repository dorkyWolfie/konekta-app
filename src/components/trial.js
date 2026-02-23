import { hasProAccess, getTrialDaysRemaining } from '@/utils/subscriptionHelpers';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { page } from "@/models/page";
import mongoose from "mongoose";
import Link from "next/link";
import { appTranslations } from "@/lib/i18n";

export default async function Trial({ lang = 'en' }) {
  const t = appTranslations[lang] || appTranslations.en;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  mongoose.connect(process.env.MONGO_URI);
  const Page = await page.findOne({owner: session.user.email});

  const isProUser = hasProAccess(session?.user);
  const trialDaysLeft = getTrialDaysRemaining(session?.user);

  return (
    <div className="text-center">
      {session?.user?.isOnTrial && (
        <div className="">
          <p className="mb-2 text-[#dc2626]">{t.trialExpiresIn} <span className="font-bold text-[#dc2626]">{trialDaysLeft} {t.trialDay}{trialDaysLeft !== 1 ? t.trialDayPlural : ''}</span></p>
          <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">{t.trialActivateProfile}</Link>
        </div>
      )}

      {!session?.user?.isOnTrial && session?.user?.subscriptionStatus === 'basic' && (
        <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">{t.trialActivateProfile}</Link>
      )}

      {!session?.user?.isOnTrial && session?.user?.subscriptionStatus === 'pro' && (
        <div>
          <p className="mb-2 text-[#15803d]">{t.profileActive}</p>
          <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">{t.questionsAndFeedback}</Link>
        </div>
      )}
    </div>
  );
}
