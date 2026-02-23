'use server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { page } from '@/models/page';

const LINK_SCHEMA = {
  key: { type: 'string', required: true },
  title: { type: 'string', maxLength: 100, required: true },
  subtitle: { type: 'string', maxLength: 200, required: false },
  url: { type: 'string', maxLength: 500, required: true },
  icon: { type: 'string', required: false }
};

function validateLinksData(links) {
  const errors = [];

  if (!Array.isArray(links)) {
    return { errors: ['Links must be an array'] };
  }

  if (links.length > 50) {
    return { errors: ['Maximum 50 links allowed'] };
  }

  const validatedLinks = links.map((link, index) => {
    const linkErrors = [];

    // Check title field
    if (link.title && typeof link.title !== 'string') {
      linkErrors.push(`Link ${index + 1}: Title must be a string`);
    } else if (link.title && link.title.trim().length > LINK_SCHEMA.title.maxLength) {
      linkErrors.push(`Link ${index + 1}: Title exceeds maximum length`);
    }
    if ((!link.title || link.title.trim().length === 0)) {
      linkErrors.push(`Link ${index + 1}: Title is required`);
    }

    if (!link.url || typeof link.url !== 'string') {
      linkErrors.push(`Link ${index + 1}: URL is required and must be a string`);
    } else if (!isValidUrl(link.url.trim())) {
      linkErrors.push(`Link ${index + 1}: Invalid URL format`);
    }

    // Check optional fields
    if (link.subtitle && typeof link.subtitle !== 'string') {
      linkErrors.push(`Link ${index + 1}: Subtitle must be a string`);
    } else if (link.subtitle && link.subtitle.trim().length > LINK_SCHEMA.subtitle.maxLength) {
      linkErrors.push(`Link ${index + 1}: Subtitle exceeds maximum length`);
    }

    if (link.icon && typeof link.icon !== 'string') {
      linkErrors.push(`Link ${index + 1}: Icon must be a string`);
     }// else if (link.icon && link.icon.trim().length > LINK_SCHEMA.icon.maxLength) {
    //   linkErrors.push(`Link ${index + 1}: Icon name exceeds maximum length`);
    // }

    errors.push(...linkErrors);

    // Sanitize translations object
    let sanitizedTranslations = {};
    if (link.translations && typeof link.translations === 'object') {
      for (const [langCode, fields] of Object.entries(link.translations)) {
        if (!fields || typeof fields !== 'object') continue;
        sanitizedTranslations[langCode] = {
          title: typeof fields.title === 'string' ? fields.title.replace(/<[^>]*>/g, '').slice(0, 100) : '',
          subtitle: typeof fields.subtitle === 'string' ? fields.subtitle.replace(/<[^>]*>/g, '').slice(0, 200) : '',
        };
      }
    }

    return {
      key: link.key?.trim() || '',
      title: link.title?.trim() || '',
      subtitle: link.subtitle?.trim() || '',
      url: link.url?.trim() || '',
      icon: link.icon?.trim() || '',
      translations: sanitizedTranslations
    };
  });

  return { validatedLinks, errors };
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export async function savePageLinks(links, formData) {
  try {
    // Connect to database with proper error handling
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Get and validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }

    // Validate input data
    const { validatedLinks, errors } = validateLinksData(links);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }


    // Sanitize email for database query
    const userEmail = session.user.email.trim().toLowerCase();

    // Prepare update data
    const updateData = {
      links: validatedLinks,
      updatedAt: new Date()
    };

    // Handle showEnglishTranslation if provided
    if (formData && formData.has('showEnglishTranslation')) {
      const showEnglishValue = formData.get('showEnglishTranslation');
      updateData.showEnglishTranslation = showEnglishValue === 'true' || showEnglishValue === true;
    }

    // Update with proper error handling
    const result = await page.updateOne(
      { owner: userEmail },
      {
        $set: updateData
      },
      {
        runValidators: true,
        upsert: false // Don't create if doesn't exist
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Page not found or access denied');
    }

    return { success: true, message: 'Links updated successfully' };

  } catch (error) {
    console.error('Error saving page links:', error.message);
    
    // Return user-friendly error messages
    if (error.message.includes('Validation failed')) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: false, 
      error: 'Failed to save links. Please try again.' 
    };
  }
}