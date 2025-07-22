'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

export default function LogoutButton({
    className = "flex items-center gap-2 border p-2 px-4 shadow hover:text-[#2563eb]",
    iconLeft = false,
    iconClasses = "",
}) {
    return (
        <button 
        onClick={() => signOut()}
        className={className}>
            {iconLeft && ( <FontAwesomeIcon icon={faArrowRightFromBracket} className={iconClasses} /> )}
            <span>Одјава</span>
            {!iconLeft && ( <FontAwesomeIcon icon={faArrowRightFromBracket} className={iconClasses} /> )}
        </button>
    );
}