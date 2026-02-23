'use server';
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { page } from "@/models/page";
import { user } from "@/models/user";
import { VALID_LANG_CODES } from "@/lib/languages";

const TRANSLATION_FIELD_LENGTHS = {
  displayName: 100,
  company: 100,
  position: 100,
  location: 100,
  bio: 500,
};

function validateInput(key, value) {
  const maxLengths = {
    displayName: 100,
    company: 100,
    position: 100,
    location: 100,
    bio: 500,
    bgColor: 7, // #ffffff
    bgColorPage: 7,
    displayName_en: 100,
    company_en: 100,
    position_en: 100,
    location_en: 100,
    bio_en: 500,
  };

  if (maxLengths[key] && value.length > maxLengths[key]) {
    return { isValid: false };
  }

  // Validate color format
  if (key === 'bgColor' && !/^#[0-9A-F]{6}$/i.test(value)) {
    return { isValid: false };
  }

  if (key === 'bgColorPage' && !/^#[0-9A-F]{6}$/i.test(value)) {
    return { isValid: false };
  }

  // Validate URLs
  if ((key === 'bgImage' || key === 'avatar') && value !== 'avatar') {
    try {
      const url = new URL(value);
      if (!url.hostname.includes(process.env.BUCKET_NAME) && !url.hostname.includes("googleusercontent.com"))
      { return { isValid: false }; }
    } catch {
      return { isValid: false };
    }
  }

  // Handle boolean conversion for showEnglishTranslation
  if (key === 'showEnglishTranslation') {
    if (value === 'true' || value === true) return { isValid: true, value: true };
    if (value === 'false' || value === false) return { isValid: true, value: false };
    return { isValid: false }; // Invalid value
  }

  // Validate primaryLanguage
  if (key === 'primaryLanguage') {
    const validCodes = ['mk', ...VALID_LANG_CODES];
    return validCodes.includes(value) ? { isValid: true, value } : { isValid: false };
  }

  // Basic XSS prevention - strip HTML
  if (typeof value === 'string') {
    return { isValid: true, value: value.replace(/<[^>]*>/g, '') };
  }

  return { isValid: true, value: value };
}

export async function savePageSettings(formData) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return false;
    }

    const dataKeys = [
      'displayName', 'company', 'position', 'location', 'bio', 'bgType', 'bgColorPage', 'bgColor', 'bgImage',
      'showEnglishTranslation', 'primaryLanguage'
    ];

    const dataToUpdate = {};
    
    for (const key of dataKeys) {
      if (formData.has(key)) {
        const rawValue = formData.get(key);
        const validationResult = validateInput(key, rawValue);

        if (!validationResult.isValid) {
          console.log(`Invalid input for ${key}:`, rawValue);
          return false;
        }

        dataToUpdate[key] = validationResult.value !== undefined ? validationResult.value : rawValue;
      }
    }

    // Handle enabledLanguages (JSON array — includes primary language)
    if (formData.has('enabledLanguages')) {
      try {
        const langs = JSON.parse(formData.get('enabledLanguages'));
        if (Array.isArray(langs)) {
          // 'mk' is valid even though it's not in VALID_LANG_CODES (handled separately in languages.js)
          dataToUpdate.enabledLanguages = langs.filter(l => l === 'mk' || VALID_LANG_CODES.includes(l));
        }
      } catch { /* ignore invalid JSON */ }
    }

    // Handle translations (JSON object: { langCode: { displayName, company, ... } })
    // Also pack primary language flat fields into translations[primaryLang]
    const primaryLang = dataToUpdate.primaryLanguage || 'mk';
    let translationsMap = {};

    if (formData.has('translations')) {
      try {
        const rawTrans = JSON.parse(formData.get('translations'));
        if (rawTrans && typeof rawTrans === 'object') {
          for (const [langCode, fields] of Object.entries(rawTrans)) {
            if (langCode !== 'mk' && !VALID_LANG_CODES.includes(langCode)) continue;
            if (!fields || typeof fields !== 'object') continue;
            translationsMap[langCode] = {};
            for (const [field, value] of Object.entries(fields)) {
              if (!TRANSLATION_FIELD_LENGTHS[field]) continue;
              if (typeof value !== 'string') continue;
              translationsMap[langCode][field] = value.replace(/<[^>]*>/g, '').slice(0, TRANSLATION_FIELD_LENGTHS[field]);
            }
          }
        }
      } catch { /* ignore invalid JSON */ }
    }

    // Always write primary language flat fields into translations[primaryLang]
    translationsMap[primaryLang] = {
      displayName: (dataToUpdate.displayName || '').slice(0, 100),
      company: (dataToUpdate.company || '').slice(0, 100),
      position: (dataToUpdate.position || '').slice(0, 100),
      location: (dataToUpdate.location || '').slice(0, 100),
      bio: (dataToUpdate.bio || '').slice(0, 500),
    };
    dataToUpdate.translations = translationsMap;

    // Update page data
    const pageUpdateResult = await page.updateOne(
      { owner: session.user.email },
      { $set: dataToUpdate },
    );

    // Update avatar if provided
    if (formData.has('avatar')) {
      const avatarLink = formData.get('avatar');
      const avatarValidationResult = validateInput('avatar', avatarLink);

      if (!avatarValidationResult.isValid) {
        console.log('Invalid avatar URL:', avatarLink);
        return false;
      }

      await user.updateOne(
        { email: session.user.email },
        { $set: { image: avatarValidationResult.value !== undefined ? avatarValidationResult.value : avatarLink } },
      );
    }

    return true;
  } catch (error) {
    return false;
  }
}