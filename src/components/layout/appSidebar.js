'use client';
import Link from "next/link";
import LogoutButton from "@/components/buttons/logoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faFileLines, faAddressCard, faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const path = usePathname();

  return (
    <nav className="inline-flex mx-auto items-start flex-col mt-8 gap-6">
      <Link href={'/account'} 
      className={"flex gap-4 items-center cursor-pointer hover:text-[#3b82f6]" 
        + (path === '/account' ? '!text-[#3b82f6] font-bold items-center' : '')} >
        <FontAwesomeIcon 
          icon={faFileLines} 
          className="w-6 h-6" />
        <span>Профил</span>
      </Link>
      <Link href={'/analytics'} 
        className={"flex gap-4 items-center cursor-pointer hover:text-[#3b82f6]" 
        + (path === '/analytics' ? '!text-[#3b82f6] font-bold items-center' : '')}>
        <FontAwesomeIcon 
          icon={faChartLine} 
          className="w-6 h-6" />
        <span>Аналитика</span>
      </Link>
      <Link href={'/contacts'} 
      className={"flex gap-4 items-center cursor-pointer hover:text-[#3b82f6]" 
        + (path === '/contacts' ? '!text-[#3b82f6] font-bold items-center' : '')} >
        <FontAwesomeIcon 
          icon={faAddressBook} 
          className="w-6 h-6" />
        <span>Контакти</span>
      </Link>
      <LogoutButton 
        iconLeft={true}
        className={"flex gap-4 items-center cursor-pointer hover:text-[#3b82f6]"}
        iconClasses={'w-6 h-6'}
      />
      <Link href={'/'} className="flex items-center gap-2 text-xs uppercase text-[#4b5563] pt-6 cursor-pointer hover:text-[#3b82f6] border-t-2 border-[#e5e7eb]">
        <FontAwesomeIcon icon={faArrowLeft} className={"w-3 h-3"} />
        <span>Назад кон почетна</span>
      </Link>
      <Link href={'https://konekta.mk'} className="flex items-center gap-2 text-xs uppercase text-[#4b5563] cursor-pointer hover:text-[#3b82f6]">
        <FontAwesomeIcon 
          icon={faAddressCard}
          className={"w-3 h-3"} />
        <span>конекта.мк</span>
      </Link>
    </nav>
  )
}