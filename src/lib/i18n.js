function hasTranslationContent(trans) {
  return trans && typeof trans === 'object' && Object.values(trans).some(v => v);
}

// Resolve the effective language to serve for a given request
export function resolveLang(page, requestedLang) {
  const primaryLang = page?.primaryLanguage || 'mk';

  if (!requestedLang || requestedLang === primaryLang) return primaryLang;

  // Check translations map (new format — after migration all content is here)
  if (hasTranslationContent(page?.translations?.[requestedLang])) {
    return requestedLang;
  }

  // Legacy EN fallback: old pages that have _en fields but haven't been migrated yet
  if (requestedLang === 'en' && page?.showEnglishTranslation) return 'en';

  // Requested lang not available — serve primary
  return primaryLang;
}

// Get localized content based on language.
// Reads from translations[lang] first, falls back to legacy flat fields for unmigrated docs.
export function getLocalizedContent(page, lang) {
  const primaryLang = page?.primaryLanguage || 'mk';
  const trans = page?.translations?.[lang] || {};
  const primaryTrans = page?.translations?.[primaryLang] || {};

  // For EN on a page not yet migrated: use legacy _en flat fields
  const legacyEn = lang === 'en' && !hasTranslationContent(trans) && page?.showEnglishTranslation;

  function pageField(field, enField) {
    return trans[field]
      || (legacyEn ? page?.[enField] : null)
      || primaryTrans[field]
      || page?.[field]
      || '';
  }

  function itemField(item, field, enField) {
    return item.translations?.[lang]?.[field]
      || (legacyEn ? item[enField] : null)
      || item[field]
      || '';
  }

  return {
    displayName: pageField('displayName', 'displayName_en'),
    company: pageField('company', 'company_en'),
    position: pageField('position', 'position_en'),
    location: pageField('location', 'location_en'),
    bio: pageField('bio', 'bio_en'),
    links: (page?.links || []).map(link => ({
      ...link,
      title: itemField(link, 'title', 'title_en'),
      subtitle: itemField(link, 'subtitle', 'subtitle_en'),
    })),
    files: (page?.files || []).map(file => ({
      ...file,
      title: itemField(file, 'title', 'title_en'),
      description: itemField(file, 'description', 'description_en'),
    })),
    buttons: (page?.buttons || []).map(button => ({
      ...button,
      title: itemField(button, 'title', 'title_en'),
    })),
  };
}

// Detect language from headers (cookie preference overrides Accept-Language)
export function detectLangFromHeaders(headersList) {
  // Check lang cookie first (user preference)
  const cookieHeader = headersList.get('cookie') || '';
  const langCookie = cookieHeader.match(/(?:^|;\s*)lang=([^;]*)/);
  if (langCookie) {
    const lang = langCookie[1];
    if (lang === 'mk' || lang === 'en') return lang;
  }
  // Fall back to Accept-Language header
  const acceptLang = headersList.get('accept-language') || '';
  return acceptLang.toLowerCase().includes('mk') ? 'mk' : 'en';
}

// App UI translations (account, analytics, contacts, template/sidebar)
export const appTranslations = {
  mk: {
    // Navigation (AppSidebar)
    navProfile: 'Профил',
    navAnalytics: 'Аналитика',
    navContacts: 'Контакти',
    navLogout: 'Одјава',
    navBackToHome: 'Назад кон почетна',
    navKonekta: 'конекта.мк',
    // Trial component
    trialExpiresIn: 'Тест верзијата истекува за',
    trialDay: 'ден',
    trialDayPlural: 'а',
    trialActivateProfile: 'Активирај го профилот',
    profileActive: 'Профилот е активен',
    questionsAndFeedback: 'Прашања и забелешки',
    // Account page / UsernameForm
    usernameFormTitle: 'Одбери корисничко иme!',
    usernameTaken: 'Ова корисничко иme е зафатено.',
    usernameSave: 'Зачувај',
    usernameValidation: 'Корисничкото иme мора да биде на латиница и не треба да содржи празно место и знаци. Може да се користат бројки. Пр. ime_prezime, ime-prezime, imePrezime, ime123',
    noActiveProfile: 'Немате активен профил',
    activateProfileLink: 'Доколку сакате да го активирате профилот',
    clickHere: 'кликнете тука',
    // Analytics page
    analyticsUnavailable: 'Аналитика не е достапна',
    profileNotActivated: 'Овој профил не е активиран. Доколку сакате да го активирате или мислите дека е грешка ве молиме',
    views: 'Прегледи',
    buttonClicks: 'Кликови од Копчиња',
    linkClicks: 'Кликови од Линкови',
    fileClicks: 'Кликови од Датотеки',
    noTitle: 'Нема наслов',
    today: 'Денес:',
    total: 'Вкупно:',
    // Contacts page
    contactsUnavailable: 'Контактите не се достапни',
    receivedContacts: 'Примени Контакти',
    noContactsReceived: 'Немате примени контакти',
    contactsWillAppear: 'Контактите ќе се појават овде кога некој ќе ги прати преку вашата страница',
    totalContacts: 'Вкупно контакти:',
  },
  en: {
    // Navigation (AppSidebar)
    navProfile: 'Profile',
    navAnalytics: 'Analytics',
    navContacts: 'Contacts',
    navLogout: 'Logout',
    navBackToHome: 'Back to home',
    navKonekta: 'konekta.mk',
    // Trial component
    trialExpiresIn: 'Trial expires in',
    trialDay: 'day',
    trialDayPlural: 's',
    trialActivateProfile: 'Activate profile',
    profileActive: 'Profile is active',
    questionsAndFeedback: 'Questions and feedback',
    // Account page / UsernameForm
    usernameFormTitle: 'Choose a username!',
    usernameTaken: 'This username is already taken.',
    usernameSave: 'Save',
    usernameValidation: 'The username must be in Latin characters and should not contain spaces or special characters. Numbers are allowed. e.g. first_last, first-last, firstLast, first123',
    noActiveProfile: "You don't have an active profile",
    activateProfileLink: 'If you want to activate your profile',
    clickHere: 'click here',
    // Analytics page
    analyticsUnavailable: 'Analytics not available',
    profileNotActivated: 'This profile is not activated. To activate it or if you think this is an error, please',
    views: 'Views',
    buttonClicks: 'Button Clicks',
    linkClicks: 'Link Clicks',
    fileClicks: 'File Clicks',
    noTitle: 'No title',
    today: 'Today:',
    total: 'Total:',
    // Contacts page
    contactsUnavailable: 'Contacts not available',
    receivedContacts: 'Received Contacts',
    noContactsReceived: 'No contacts received',
    contactsWillAppear: 'Contacts will appear here when someone sends them through your page',
    totalContacts: 'Total contacts:',
  },
};

// Website UI translations (login, register, contact pages)
export const websiteTranslations = {
  mk: {
    // Common links
    toLogin: 'Кон најава',
    toKonekta: 'Кон конекта.мк',
    toProfile: 'Кон профил',
    or: 'или',
    // Login page
    loginH1: 'Добредојде во Конекта!',
    loginH2: 'Најави се во твојот профил.',
    noProfile: 'Немаш профил?',
    registerLink: 'Регистрирај се',
    // SignInForm
    emailLabel: 'Е-пошта',
    emailPlaceholder: 'Е-пошта',
    passwordLabel: 'Лозинка',
    passwordPlaceholder: 'Лозинка',
    signInBtn: 'Најави се',
    signingIn: 'Ве најавува...',
    signInSuccess: 'Успешно се најавивте!',
    signInWrongCreds: 'Погрешна е-пошта или лозинка.',
    generalError: 'Се појави грешка. Ве молиме обидете се повторно.',
    // LoginGoogle
    loginWithGoogle: 'Најава со Google',
    // Register page
    registerH1: 'Добредојде во Конекта!',
    registerH2: 'Регистрирај се и креирај го твојот нов конекта профил.',
    // RegisterForm
    nameLabel: 'Иme',
    namePlaceholder: 'Иme',
    registerBtn: 'Регистрирај се',
    registering: 'Се креира профилот...',
    registerSuccess: 'Профилот е успешно креиран! Ве молиме најавете се.',
    registerError: 'Профилот не е креиран. Ве молиме обидете се повторно.',
    // Kontakt page
    contactH1: 'Контактирај не!',
    contactSubtitle1: 'Имаш прашања или забелешки?',
    contactSubtitle2: 'Пополни ја формата и ќе те контатираме во најкраток можен рок!',
    // ContactForm
    contactFirstName: 'Иme*',
    contactLastName: 'Презиme*',
    contactEmailLabel: 'E-mail*',
    contactPhone: 'Телефонски број',
    contactMessage: 'Порака',
    contactSend: 'Испрати',
    contactSending: 'Се испраќа...',
    contactSuccess: 'Пораката е успешно испратена!',
    contactError: 'Се појави грешка. Ве молиме обидете се повторно.',
  },
  en: {
    // Common links
    toLogin: 'To login',
    toKonekta: 'To konekta.mk',
    toProfile: 'To profile',
    or: 'or',
    // Login page
    loginH1: 'Welcome to Konekta!',
    loginH2: 'Sign in to your profile.',
    noProfile: "Don't have a profile?",
    registerLink: 'Register',
    // SignInForm
    emailLabel: 'Email',
    emailPlaceholder: 'Email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password',
    signInBtn: 'Sign in',
    signingIn: 'Signing in...',
    signInSuccess: 'Successfully signed in!',
    signInWrongCreds: 'Incorrect email or password.',
    generalError: 'An error occurred. Please try again.',
    // LoginGoogle
    loginWithGoogle: 'Sign in with Google',
    // Register page
    registerH1: 'Welcome to Konekta!',
    registerH2: 'Register and create your new Konekta profile.',
    // RegisterForm
    nameLabel: 'Name',
    namePlaceholder: 'Name',
    registerBtn: 'Register',
    registering: 'Creating profile...',
    registerSuccess: 'Profile created successfully! Please sign in.',
    registerError: 'Profile not created. Please try again.',
    // Kontakt page
    contactH1: 'Contact us!',
    contactSubtitle1: 'Have questions or feedback?',
    contactSubtitle2: "Fill out the form and we'll get back to you as soon as possible!",
    // ContactForm
    contactFirstName: 'First Name*',
    contactLastName: 'Last Name*',
    contactEmailLabel: 'E-mail*',
    contactPhone: 'Phone number',
    contactMessage: 'Message',
    contactSend: 'Send',
    contactSending: 'Sending...',
    contactSuccess: 'Message sent successfully!',
    contactError: 'An error occurred. Please try again.',
  },
};

// Error messages by language
export const errorMessages = {
  mk: {
    pageNotFound: "Страната не е пронајдена",
    returnHome: "Врати се на почетна",
    noActiveProfile: "Немате активен профил.",
    activateProfile: "Доколку сакате да го активирате профилот",
    activateHere: "кликнете тука"
  },
  en: {
    pageNotFound: "Page not found",
    returnHome: "Return to home",
    noActiveProfile: "You don't have an active profile.",
    activateProfile: "If you want to activate your profile",
    activateHere: "click here"
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
    firstNamePlaceholder: "Име* (задолжително)",
    lastName: "Презиме*",
    lastNamePlaceholder: "Презиме* (задолжително)",
    company: "Фирма",
    position: "Позиција",
    email: "Е-пошта*",
    emailPlaceholder: "Е-пошта* (задолжително)",
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
    firstNamePlaceholder: "First Name* (required)",
    lastName: "Last Name*",
    lastNamePlaceholder: "Last Name* (required)",
    company: "Company",
    position: "Position",
    email: "Email*",
    emailPlaceholder: "Email* (required)",
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