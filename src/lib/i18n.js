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