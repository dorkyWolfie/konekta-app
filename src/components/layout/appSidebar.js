'use client';
import Link from "next/link";
import LogoutButton from "@/components/buttons/logoutButton";
import LangSwitcher from "@/components/ui/langSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faFileLines, faAddressCard, faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { usePathname } from "next/navigation";
import { appTranslations } from "@/lib/i18n";

export default function AppSidebar({ lang = 'mk' }) {
  const t = appTranslations[lang] || appTranslations.mk;
  const path = usePathname();

  return (
    <nav className="inline-flex mx-auto items-start flex-col mt-8 sm:gap-6 gap-4">
      <Link href={'/account'}
      className={"sidebarLink"
        + (path === '/account' ? '!text-[#3b82f6] font-[900] flex items-center gap-4 mobileActive' : '')} >
        <FontAwesomeIcon
          icon={faFileLines}
          className="w-6 h-6" />
        <span>{t.navProfile}</span>
      </Link>
      <Link href={'/analytics'}
        className={"sidebarLink"
        + (path === '/analytics' ? '!text-[#3b82f6] font-[900] flex items-center gap-4 mobileActive' : '')}>
        <FontAwesomeIcon
          icon={faChartLine}
          className="w-6 h-6" />
        <span>{t.navAnalytics}</span>
      </Link>
      <Link href={'/contacts'}
        className={"sidebarLink"
        + (path === '/contacts' ? '!text-[#3b82f6] font-[900] flex items-center gap-4 mobileActive' : '')} >
        <FontAwesomeIcon
          icon={faAddressBook}
          className="w-6 h-6" />
        <span>{t.navContacts}</span>
      </Link>
      <LogoutButton
        iconLeft={true}
        className={"sidebarLink"}
        iconClasses={'w-6 h-6'}
        label={t.navLogout}
      />
      <Link href={'/'} className="sidebarLink sidebarLink2 pt-6 mt-2 border-t-2 border-[#e5e7eb]">
        <FontAwesomeIcon icon={faArrowLeft} className={"w-3 h-3"} />
        <span>{t.navBackToHome}</span>
      </Link>
      <Link href={'https://konekta.mk'} className="sidebarLink sidebarLink2">
        <FontAwesomeIcon
          icon={faAddressCard}
          className={"w-3 h-3"} />
        <span>{t.navKonekta}</span>
      </Link>
      <LangSwitcher lang={lang} />
    </nav>
  )
}
