'use server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { page } from '@/models/page';

// Input validation schemas
const BUTTON_FIELDS = [
  'email', 'phone', 'whatsapp', 'instagram', 'facebook', 'twitter', 
  'linkedin', 'youtube', 'tiktok', 'website', 'github', 'discord', 'telegram'
];

const BUTTON_SCHEMA = {
  key: { type: 'string', required: true },
  type: { type: 'string', required: true },
  title: { type: 'string', maxLength: 100, required: true },
  title_en: { type: 'string', maxLength: 100, required: false },
  value: { type: 'string', maxLength: 500, required: true },
  icon: { type: 'string', maxLength: 500, required: false },
  isActive: { type: 'boolean', required: false, default: true },
  isCustom: { type: 'boolean', required: false, default: false }
};

function validateButtonsData(buttonsData) {
  const errors = [];
  let validatedButtons = [];

  // Only accept array format
  if (!Array.isArray(buttonsData)) {
    return { errors: ['Invalid buttons data format - array expected'] };
  }

  validatedButtons = buttonsData;

  if (validatedButtons.length > 20) {
    return { errors: ['Maximum 20 buttons allowed'] };
  }

  const processedButtons = validatedButtons.map((button, index) => {
    const buttonErrors = [];

    // Validate required fields
    if (!button.key || typeof button.key !== 'string') {
      buttonErrors.push(`Button ${index + 1}: Key is required and must be a string`);
    }

    if (!button.type || typeof button.type !== 'string') {
      buttonErrors.push(`Button ${index + 1}: Type is required and must be a string`);
    } else if (!BUTTON_FIELDS.includes(button.type) && !button.type.startsWith('custom_')) {
      // Allow predefined types and custom types (starting with 'custom_')
      buttonErrors.push(`Button ${index + 1}: Invalid button type "${button.type}"`);
    }

    if (button.title && typeof button.title !== 'string') {
      buttonErrors.push(`Button ${index + 1}: Title must be a string`);
    } else if (button.title && button.title.trim().length > BUTTON_SCHEMA.title.maxLength) {
      buttonErrors.push(`Button ${index + 1}: Title exceeds maximum length`);
    }
    // Require at least one of title (MK) or title_en (EN)
    if ((!button.title || button.title.trim().length === 0) && (!button.title_en || button.title_en.trim().length === 0)) {
      buttonErrors.push(`Button ${index + 1}: Either a MK or EN title is required`);
    }

    if (!button.value || typeof button.value !== 'string') {
      buttonErrors.push(`Button ${index + 1}: Value is required and must be a string`);
    } else if (button.value.trim().length === 0) {
      buttonErrors.push(`Button ${index + 1}: Value cannot be empty`);
    } else if (button.value.trim().length > BUTTON_SCHEMA.value.maxLength) {
      buttonErrors.push(`Button ${index + 1}: Value exceeds maximum length`);
    } else {
      // Validate value based on button type
      const trimmedValue = button.value.trim();
      
      if (button.type === 'email' && !isValidEmail(trimmedValue)) {
        buttonErrors.push(`Button ${index + 1}: Invalid email format`);
      }

      if (button.type === 'phone' && !/^[\d\s\-\+\(\)\.]{3,20}$/.test(trimmedValue)) {
        buttonErrors.push(`Button ${index + 1}: Invalid phone format`);
      }

      if (button.type === 'whatsapp') {
        // WhatsApp can be phone number or URL
        if (!(/^[\d\s\-\+\(\)\.]{3,20}$/.test(trimmedValue) || isValidUrl(trimmedValue))) {
          buttonErrors.push(`Button ${index + 1}: Invalid WhatsApp format (use phone number or URL)`);
        }
      }

      if (button.type === 'discord') {
        // Discord can be URL or username#discriminator
        if (!(isValidUrl(trimmedValue) || /^.+#\d{4}$/.test(trimmedValue) || trimmedValue.startsWith('@'))) {
          buttonErrors.push(`Button ${index + 1}: Invalid Discord format (use URL, username#1234, or @username)`);
        }
      }

      if (button.type === 'telegram') {
        // Telegram can be URL or @username
        if (!(isValidUrl(trimmedValue) || trimmedValue.startsWith('@'))) {
          buttonErrors.push(`Button ${index + 1}: Invalid Telegram format (use URL or @username)`);
        }
      }

      if (['website', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'github'].includes(button.type)) {
        if (!isValidUrl(trimmedValue)) {
          buttonErrors.push(`Button ${index + 1}: Invalid URL format`);
        }
      }

      // For custom buttons, validate as URL by default unless it's clearly not meant to be one
      if (button.type.startsWith('custom_') && trimmedValue.includes('.') && !isValidUrl(trimmedValue)) {
        buttonErrors.push(`Button ${index + 1}: Invalid URL format for custom button`);
      }
    }

    // Validate optional fields
    if (button.icon && typeof button.icon !== 'string') {
      buttonErrors.push(`Button ${index + 1}: Icon must be a string`);
    } else if (button.icon && button.icon.trim().length > 500) {
      buttonErrors.push(`Button ${index + 1}: Icon URL exceeds maximum length`);
    }

    if (button.isActive !== undefined && typeof button.isActive !== 'boolean') {
      buttonErrors.push(`Button ${index + 1}: isActive must be a boolean`);
    }

    if (button.isCustom !== undefined && typeof button.isCustom !== 'boolean') {
      buttonErrors.push(`Button ${index + 1}: isCustom must be a boolean`);
    }

    // Validate optional title_en field
    if (button.title_en && typeof button.title_en !== 'string') {
      buttonErrors.push(`Button ${index + 1}: English title must be a string`);
    } else if (button.title_en && button.title_en.trim().length > BUTTON_SCHEMA.title_en.maxLength) {
      buttonErrors.push(`Button ${index + 1}: English title exceeds maximum length`);
    }

    errors.push(...buttonErrors);

    return {
      key: button.key?.trim() || '',
      type: button.type?.trim() || '',
      title: button.title?.trim() || '',
      title_en: button.title_en?.trim() || '',
      value: button.value?.trim() || '',
      icon: button.icon?.trim() || '',
      isActive: button.isActive !== undefined ? button.isActive : true,
      isCustom: button.isCustom !== undefined ? button.isCustom : button.type?.startsWith('custom_') || false
    };
  });

  return { validatedButtons: processedButtons, errors };
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Main function - accepts only array format
export async function savePageButtons(buttonsArray, formData) {
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

    // Validate input data (only array format accepted)
    const { validatedButtons, errors } = validateButtonsData(buttonsArray);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }


    // Sanitize email for database query
    const userEmail = session.user.email.trim().toLowerCase();

    // Prepare update data
    const updateData = {
      buttons: validatedButtons,  // Store as array
      updatedAt: new Date()
    };

    // Handle showEnglishTranslation if provided
    if (formData && formData.has('showEnglishTranslation')) {
      const showEnglishValue = formData.get('showEnglishTranslation');
      updateData.showEnglishTranslation = showEnglishValue === 'true' || showEnglishValue === true;
    }

    // Update with proper error handling - only store array format
    const result = await page.updateOne(
      { owner: userEmail },
      {
        $set: updateData,
        $unset: {
          buttonsArray: ""  // Remove old buttonsArray field if it exists
        }
      },
      {
        runValidators: true,
        upsert: false // Don't create if doesn't exist
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('Page not found or access denied');
    }

    return { success: true, message: 'Buttons updated successfully' };

  } catch (error) {
    console.error('Error saving page buttons:', error.message);
    
    // Return user-friendly error messages
    if (error.message.includes('Validation failed')) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: false, 
      error: 'Failed to save buttons. Please try again.' 
    };
  }
}