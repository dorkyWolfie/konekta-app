// Get localized content based on language
export function getLocalizedContent(page, lang = 'mk') {
  if (lang === 'en') {
    return {
      displayName: page.displayName_en || page.displayName,
      company: page.company_en || page.company,
      position: page.position_en || page.position,
      location: page.location_en || page.location,
      bio: page.bio_en || page.bio,
      links: page.links ? page.links.map(link => ({
        ...link,
        title: link.title_en || link.title,
        subtitle: link.subtitle_en || link.subtitle
      })) : [],
      files: page.files ? page.files.map(file => ({
        ...file,
        title: file.title_en || file.title,
        description: file.description_en || file.description
      })) : [],
      buttons: page.buttons ? page.buttons.map(button => ({
        ...button,
        title: button.title_en || button.title
      })) : []
    };
  }

  // Default to Macedonian
  return {
    displayName: page.displayName,
    company: page.company,
    position: page.position,
    location: page.location,
    bio: page.bio,
    links: page.links || [],
    files: page.files || [],
    buttons: page.buttons || []
  };
}

// Error messages by language
export const errorMessages = {
  mk: {
    pageNotFound: "Страната не е пронајдена",
    returnHome: "Врати се на почетна",
    noActiveProfile: "Немате активен профил.",
    activateProfile: "Доколку сакате да го активирате профилот"
  },
  en: {
    pageNotFound: "Page not found",
    returnHome: "Return to home",
    noActiveProfile: "You don't have an active profile.",
    activateProfile: "If you want to activate your profile"
  }
};

// Contact messages by language
export const contactMessages = {
  mk: {
    success: "Контактот е успешно испратен!",
    error: "Грешка при праќање!",
    h1: "Размени контакт",
    description: "Прати ги твоите информации на",
    firstName: "Име*",
    lastName: "Презиме*",
    company: "Фирма",
    position: "Позиција",
    email: "Е-пошта*",
    phone: "Телефон",
    save: "Испрати контакт",
    buttonText: "Размени контакт"
  },
  en: {
    success: "Contact successfully sent!",
    error: "Error sending contact!",
    h1: "Exchange Contact",
    description: "Send your information to",
    firstName: "First Name*",
    lastName: "Last Name*",
    company: "Company",
    position: "Position",
    email: "Email*",
    phone: "Phone",
    save: "Send Contact",
    buttonText: "Exchange Contact"
  }
}

// Share contact messages by language
export const shareContactMessages = {
  mk: {
    buttonText: "Сподели контакт",
    h1: "Сподели контакт",
    description: "Скенирај го QR кодот или искористи ги опциите подолу",
    copyUrl: "Копирај го линкот",
    urlCopied: "Линкот е копиран!",
    share: "Сподели",
    shareTitle: "Погледнете го мојот Конекта профил",
    copyError: "Грешка при копирање",
    shareError: "Грешка при споделување"
  },
  en: {
    buttonText: "Share Contact",
    h1: "Share Contact",
    description: "Scan the QR code or use the options below",
    copyUrl: "Copy URL",
    urlCopied: "URL copied!",
    share: "Share",
    shareTitle: "Check out my Konekta profile",
    copyError: "Error copying URL",
    shareError: "Error sharing"
  }
}