import SectionBox from "@/components/layout/sectionBox";
import mongoose from "mongoose";
import Link from "next/link";
import { page } from "@/models/page";
import { user } from "@/models/user";
import { contact } from "@/models/contact";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding, faBriefcase, faEnvelope, faPhone, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { headers } from "next/headers";
import { detectLangFromHeaders, appTranslations } from "@/lib/i18n";

export default async function ContactsPage() {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  }

  const headersList = await headers();
  const lang = detectLangFromHeaders(headersList);
  const t = appTranslations[lang];

  const User = await user.findOne({ email: session.user.email }).lean();

  if (!User || User.subscriptionStatus !== 'pro') {
    return (
      <SectionBox>
        <h2>{t.contactsUnavailable}</h2>
        <p>{t.profileNotActivated} <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">{t.clickHere}</Link></p>
      </SectionBox>
    )
  }

  // Get all contacts for pages owned by this user
  const contacts = await contact.find({ targetPageOwner: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  // Get page information for grouping
  const pages = await page.find({ owner: session.user.email }).lean();
  const pageMap = {};
  pages.forEach(p => {
    pageMap[p.uri] = p;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString(lang === 'en' ? 'en-US' : 'mk-MK', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SectionBox>
      <h2 className="text-xl mb-6 font-bold text-center">{t.receivedContacts}</h2>
      {contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((contactItem) => (
            <div key={contactItem._id} className="border-t border-[#e5e7eb] py-4 my-0">
              {/* Header with page info and date */}
              <div className="flex justify-end items-center pb-3">
                <div className="flex items-center text-sm text-[#6b7280]">
                  <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-1" />
                  {formatDate(contactItem.createdAt)}
                </div>
              </div>
              {/* Contact Details */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Contact First and Last Name */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3 text-[#9ca3af]" />
                    <span className="font-medium">{contactItem.contactName} {contactItem.contactLastName}</span>
                  </div>
                  {/* Contact email */}
                  {contactItem.contactEmail && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-3 text-[#9ca3af]" />
                      <a href={`mailto:${contactItem.contactEmail}`}
                         className="text-[#2563eb] hover:text-[#1e40af] hover:underline">
                        {contactItem.contactEmail}
                      </a>
                    </div>
                  )}
                  {/* Contact phone */}
                  {contactItem.contactPhone && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-3 text-[#9ca3af]" />
                      <a href={`tel:${contactItem.contactPhone}`}
                         className="text-[#2563eb] hover:text-[#1e40af] hover:underline">
                        {contactItem.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
                {/* Contact company */}
                <div className="space-y-3">
                  {contactItem.contactCompany && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 mr-3 text-[#9ca3af]" />
                      <span>{contactItem.contactCompany}</span>
                    </div>
                  )}
                  {/* Contact position */}
                  {contactItem.contactPosition && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4 mr-3 text-[#9ca3af]" />
                      <span>{contactItem.contactPosition}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#6b7280] text-lg">{t.noContactsReceived}</p>
          <p className="text-sm text-[#9ca3af] mt-2">{t.contactsWillAppear}</p>
        </div>
      )}

      {/* Stats summary */}
      {contacts.length > 0 && (
        <div className="mt-6 p-4 bg-[#f9fafb] rounded-lg">
          <p className="text-sm text-[#4b5563]">
            <strong>{t.totalContacts}</strong> {contacts.length}
          </p>
        </div>
      )}
    </SectionBox>
  )
}
