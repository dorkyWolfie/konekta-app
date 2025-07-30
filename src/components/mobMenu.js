'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

// OPEN MOBILE SIDEBAR (ASIDE)
export function openAside() {
  document.getElementById("sidebar").style.display = "flex";
}

// CLOSE MOBILE SIDEBAR (ASIDE)
export function closeAside() {
  document.getElementById("sidebar").style.display = "none";
}

// OPEN MOBILE HEADER
export function OpenMenu() {
  document.getElementById("header").style.display = "flex";
}

// CLOSE MOBILE HEADER
export function CloseMenu() {
  document.getElementById("header").style.display = "none";
}

// FUNCTION SCROLL TO TOP
export function scrollTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// BUTTON SCROLL TO TOP
export default function ScrollButton() {
  return (
    <button onClick={scrollTop} className="absolute bottom-6 right-20 fixed px-3 py-2 bg-[#3b82f6] rounded-full text-white hover:bg-[#1d4ed8] z-10">
      <FontAwesomeIcon icon={faArrowUp} className='w-4 h-4' />
    </button>
  );
}