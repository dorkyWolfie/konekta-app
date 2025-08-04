import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import SaveContact from "@/components/buttons/saveContact";
import SectionBox from "@/components/layout/sectionBox";
import { page } from "@/models/page";
import { user } from "@/models/user";
import { event } from "@/models/event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faLocationDot, faPhone, faEnvelope, faBriefcase, faGlobe, faUser, faFile } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faFacebook, faGithub, faInstagram, faTelegram, faTiktok, faWhatsapp, faYoutube, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export const icons = {
  email: faEnvelope,
  phone: faPhone,
  whatsapp: faWhatsapp,
  website: faGlobe,
  instagram: faInstagram,
  facebook: faFacebook,
  twitter: faTwitter,
  linkedin: faLinkedin,
  youtube: faYoutube,
  tiktok: faTiktok,
  github: faGithub,
  discord: faDiscord,
  telegram: faTelegram,
  custom: faUser // Default icon for custom buttons
};

// Enhanced button link function to handle all button types
function buttonLink(type, value) {
  const trimmedValue = value.trim();
  
  switch (type) {
    case 'phone':
    case 'whatsapp':
      // Handle WhatsApp - if it's a URL, use as is, otherwise format as tel
      if (type === 'whatsapp' && (trimmedValue.startsWith('http') || trimmedValue.startsWith('https'))) {
        return trimmedValue;
      }
      return `tel:${trimmedValue}`;
    
    case 'email':
      return `mailto:${trimmedValue}`;
    
    case 'discord':
      // If it's already a URL, use as is
      if (trimmedValue.startsWith('http')) {
        return trimmedValue;
      }
      // For username#discriminator or @username, could link to a discord profile search
      return `https://discord.com/users/${trimmedValue.replace(/[@#]/g, '')}`;
    
    case 'telegram':
      // If it's already a URL, use as is
      if (trimmedValue.startsWith('http')) {
        return trimmedValue;
      }
      // For @username format
      if (trimmedValue.startsWith('@')) {
        return `https://t.me/${trimmedValue.substring(1)}`;
      }
      return `https://t.me/${trimmedValue}`;
    
    default:
      // For all other types (website, social media, custom), ensure proper URL format
      if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
        return trimmedValue;
      }
      return `https://${trimmedValue}`;
  }
}

// function getSafeImageSrc(src) {
//   if (typeof src !== "string") return "/konekta_logo_4.png";

//   // Allow only if it's a valid URL or starts with /
//   if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
//     return src;
//   }

//   return "/konekta_logo_4.png";
// }

// Helper function to get the button type from custom types
export function getButtonType(buttonType) {
  if (buttonType.startsWith('custom_')) {
    return 'custom';
  }
  return buttonType;
}

export default async function UserPage({params}) {
  const resolvedParams = await params;
  const uri = resolvedParams.uri;

  await mongoose.connect(process.env.MONGO_URI);

  const Page = await page.findOne({uri});
  const User = await user.findOne({email: Page?.owner});

  await event.create({uri:uri, page:uri, type:"view"});

  if (!Page) {
    return (
      <div className="p-8 text-center text-[#ef4444]">
        <h2>Страната не е пронајдена: <strong>/{uri}</strong></h2>
        <Link href="/" className="underline text-[#2563eb] mt-20">Врати се на почетна</Link>
      </div>
    );
  }

  // Get active buttons - check both new 'buttons' array and legacy 'buttonsArray'
  let activeButtons = [];
  
  if (Page.buttons && Array.isArray(Page.buttons)) {
    // New format: buttons array
    activeButtons = Page.buttons.filter(button => 
      button.isActive && button.value && button.value.trim() !== ''
    );
  } else if (Page.buttonsArray && Array.isArray(Page.buttonsArray)) {
    // Legacy format: buttonsArray
    activeButtons = Page.buttonsArray.filter(button => 
      button.isActive && button.value && button.value.trim() !== ''
    );
  }

  if (!User || User.subscriptionStatus !== 'pro') {
    return (
      <SectionBox>
        <h2>Немате активен профил.</h2>
        <p>Доколку сакате да го активирате профилот <Link href="/kontakt" className="text-[#2563eb] hover:[#1d4ed8] hover:underline">кликнете тука</Link></p>
      </SectionBox>
    )
  }

  return (
    <main>
      {/* bg color overlay on entire page */}
      <div className="w-full h-screen fixed z-[-10] absolute top-0 bg-[#f9fafb]" style={{background: Page.bgColor, opacity: .2}}></div>
      {/* bg color or image set from account above the avatar image */}
      <div 
        className="h-80 bg-[#dbeafe] bg-cover bg-center"
        style={
          Page.bgType === 'color'
            ? { backgroundColor: Page.bgColor }
            : { backgroundImage: `url(${Page.bgImage})` }
        }>
      </div>
      {/* avatar image */}
      <Image src={User.image} alt={"avatar"} width={150} height={150} className="rounded-full border-4 border-white shadow shadow-black/50 aspect-square object-cover mx-auto -mt-16" />
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-2xl font-bold">{Page.displayName}</h2>
          <h3 className="flex flex-row items-center gap-2 mt-1 text-[#374151] text-sm">
            {Page.company && (
              <span className="flex flex-row items-center gap-2 mt-1 mb-1 text-[#374151] text-sm">
                <FontAwesomeIcon icon={faBriefcase} width={10} />
                {Page.company}
                <span>•</span>
              </span>
            )}
            <span>{Page.position}</span>
          </h3>
          <h3 className="flex flex-row gap-2 mt-1 mb-1 text-[#374151] text-sm">
            {Page.location && (<span className="flex flex-row items-center gap-2 mt-1 mb-1 text-[#374151] text-sm"><FontAwesomeIcon icon={faLocationDot} width={10} /> {Page.location}</span>)}
          </h3>
          <p className="max-w-md mx-auto text-center text-[#1f2937] text-md">{Page.bio}</p>
        </div>
        {/* Buttons section */}
        {activeButtons.length > 0 && (
          <div className="my-4 flex flex-row flex-wrap justify-center items-center gap-4">
            {activeButtons.map(button => (
              <Link
                key={button.key} 
                ping={`${process.env.URL}/api/click?url=${btoa(button.value)}&page=${Page.uri}`}
                target="_blank"
                href={buttonLink(getButtonType(button.type), button.value)} 
                className="aspect-square rounded-full bg-white/75 shadow-sm p-3 text-center flex items-center justify-center hover:bg-white/90 transition-colors"
                title={button.title || button.type}>
                {button.icon ? (
                  <Image src={button.icon} alt={button.title || button.type} width={24} height={24} className="w-6 h-6 object-contain" />
                ) : (
                  <FontAwesomeIcon icon={icons[getButtonType(button.type)] || (button.isCustom ? faUser : faGlobe)} className="w-6 h-6" />
                )}
              </Link>
            ))}
          </div>
        )}
        {/* Links section */}
        <div className="grid md:grid-cols-2 gap-4">
          {Page.links.map(link => (
            <Link 
              key={link.title} 
              ping={process.env.URL+'/api/click?url='+btoa(link.url)+'&page='+Page.uri}
              target="_blank" 
              href={link.url} 
              className="bg-white/75 shadow-sm p-2 flex gap-4 items-center" >
              <div className="corner-border !border-[rgba(100,100,100,0.25)] aspect-square w-15 h-15 p-2 flex justify-center items-center">
                {link.icon && (
                  <Image src={link.icon} alt={'icon'} width={256} height={256} className="w-20 h-20 object-contain" />
                )}
                {!link.icon && (
                  <FontAwesomeIcon icon={faLink} />
                )}
              </div>
              <div>
                <h3>{link.title}</h3>
                <p>{link.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
        {/* Files section */}
        <div className="grid md:grid-cols-2 gap-4 my-4">
          {Page.files.map(file => (
            <Link 
              key={file.title} 
              ping={process.env.URL+'/api/click?url='+btoa(file.url)+'&page='+Page.uri}
              target="_blank" 
              href={file.url} 
              className="bg-white/75 shadow-sm p-2 flex gap-4 items-center" >
              <div className="corner-border !border-[rgba(100,100,100,0.25)] aspect-square w-15 h-15 p-2 flex justify-center items-center">
                {file.url && file.type === 'application/pdf' && (
                  <FontAwesomeIcon icon={faFile} />
                ) || (
                  <Image src={file.url} alt={file.title || 'uploaded file'} className="w-full h-full object-cover" width={256} height={256} />
                )}
              </div>
              <div>
                <h3>{file.title}</h3>
                <p>{file.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="relative">
        <SaveContact uri={Page.uri} className="button-1 shadow text-sm fixed absolute z-10 bottom-2 left-[50%] transform -translate-x-[50%]" />
      </div>
    </main>
  )
}