'use client';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faBuilding, faCopy, faShare } from "@fortawesome/free-solid-svg-icons";
import { getLocalizedContent, shareContactMessages } from "@/lib/i18n";
import QRCode from "react-qr-code";
import Image from "next/image";

export default function ShareContactForm({ page, user, lang = 'mk' }) {
  const messages = shareContactMessages[lang];
  const content = getLocalizedContent(page, lang);
  const [copied, setCopied] = useState(false);

  // Helper function for safe image src
  function getSafeImageSrc(src) {
    if (typeof src !== "string") return "/user-astronaut-solid-full.webp";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      return src;
    }
    return "/user-astronaut-solid-full.webp";
  }

  // Generate the full URL for the profile
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${page?.uri}`
    : '';

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(profileUrl);
        toast.success(messages.urlCopied);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = profileUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success(messages.urlCopied);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.error(messages.copyError);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      toast.error(messages.copyError);
    }
  };

  // Native share functionality
  const handleShare = async () => {
    try {
      await navigator.share({
        title: messages.shareTitle,
        text: `${messages.shareTitle} - ${content?.displayName || page?.owner}`,
        url: profileUrl
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled, do nothing
        return;
      }
      // Share not supported or other error - fallback to copy
      handleCopyUrl();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-center mb-2">{messages.h1}</h1>
        <p className="text-center text-[#4b5563]">{messages.description}</p>
      </div>
      {/* User info */}
      <div className="flex flex-row gap-4 items-center justify-center">
        <Image src={getSafeImageSrc(user?.image)} width={50} height={50} alt={"avatar"} className="aspect-square object-cover rounded-full" />
        <div>
          <h2 className="!text-lg">{content?.displayName || page?.owner}</h2>
          <p className="flex gap-2 items-center justify-center text-[#374151] text-xs">
            {content.company && (
              <span className="flex flex-row items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="w-3 h-3" />
                {content.company}
                <span>•</span>
              </span>
            )}
            {content.position && (
              <span className="flex flex-row items-center gap-2">
                <FontAwesomeIcon icon={faBriefcase} className="pt-[1px] w-3 h-3" />
                {content.position}
              </span>
            )}
          </p>
        </div>
      </div>
      {/* QR Code */}
      <div className="bg-white p-4 shadow-md">
        <QRCode
          value={profileUrl}
          size={150}
          level="H"
        />
      </div>
      {/* Profile URL display */}
      <div className="w-full bg-[#f3f4f6] px-4 py-2 text-center text-sm text-[#374151] break-all">
        {profileUrl}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleCopyUrl}
          className={`flex-1 flex items-center justify-center gap-2 button-1 ${
            copied
              ? 'bg-[#16a34a] text-white'
              : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
          }`}
        >
          <FontAwesomeIcon icon={faCopy} />
          <span>{copied ? '✓ ' + messages.urlCopied : messages.copyUrl}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 button-2"
        >
          <FontAwesomeIcon icon={faShare} />
          <span>{messages.share}</span>
        </button>
      </div>
    </div>
  );
}
