'use server';
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { page } from "@/models/page";
import { user } from "@/models/user";

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
      'displayName_en', 'company_en', 'position_en', 'location_en', 'bio_en', 'showEnglishTranslation'
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