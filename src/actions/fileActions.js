'use server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { page } from '@/models/page';

const FILE_SCHEMA = {
  key: { type: String, required: true },
  title: { maxLength: 100, required: true },
  description: { maxLength: 500, required: false },
  url: { maxLength: 1000, required: true },
  name: { maxLength: 255, required: true },
  type: { maxLength: 100, required: true },
  size: { max: 10485760, required: true } // 10MB max
};

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_COUNT = 20;

function validateFilesData(files) {
  const errors = [];

  if (!Array.isArray(files)) {
    return { errors: ['Files must be an array'] };
  }

  if (files.length > MAX_FILES_COUNT) {
    return { errors: [`Maximum ${MAX_FILES_COUNT} files allowed`] };
  }

  const validatedFiles = files.map((file, index) => {
    const fileErrors = [];

    // Check required title
    if (!file.title || typeof file.title !== 'string') {
      fileErrors.push(`File ${index + 1}: Title is required and must be a string`);
    } else if (file.title.trim().length === 0) {
      fileErrors.push(`File ${index + 1}: Title cannot be empty`);
    } else if (file.title.trim().length > FILE_SCHEMA.title.maxLength) {
      fileErrors.push(`File ${index + 1}: Title exceeds maximum length of ${FILE_SCHEMA.title.maxLength} characters`);
    }

    // Check required fileUrl
    if (!file.url || typeof file.url !== 'string') {
      fileErrors.push(`File ${index + 1}: File URL is required and must be a string`);
    } else if (!isValidUrl(file.url.trim())) {
      fileErrors.push(`File ${index + 1}: Invalid file URL format`);
    } else if (file.url.trim().length > FILE_SCHEMA.url.maxLength) {
      fileErrors.push(`File ${index + 1}: File URL exceeds maximum length`);
    }

    // Check required fileName
    if (!file.name || typeof file.name !== 'string') {
      fileErrors.push(`File ${index + 1}: File name is required and must be a string`);
    } else if (file.name.trim().length === 0) {
      fileErrors.push(`File ${index + 1}: File name cannot be empty`);
    } else if (file.name.trim().length > FILE_SCHEMA.name.maxLength) {
      fileErrors.push(`File ${index + 1}: File name exceeds maximum length`);
    }

    // Check required fileType
    if (!file.type || typeof file.type !== 'string') {
      fileErrors.push(`File ${index + 1}: File type is required and must be a string`);
    } else if (!ALLOWED_FILE_TYPES.includes(file.type.trim().toLowerCase())) {
      fileErrors.push(`File ${index + 1}: File type '${file.type}' is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
    }

    // Check required fileSize
    if (typeof file.size !== 'number') {
      fileErrors.push(`File ${index + 1}: File size must be a number`);
    } else if (file.size <= 0) {
      fileErrors.push(`File ${index + 1}: File size must be greater than 0`);
    } else if (file.size > MAX_FILE_SIZE) {
      fileErrors.push(`File ${index + 1}: File size exceeds maximum limit of ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`);
    }

    // Check optional description
    if (file.description && typeof file.description !== 'string') {
      fileErrors.push(`File ${index + 1}: Description must be a string`);
    } else if (file.description && file.description.trim().length > FILE_SCHEMA.description.maxLength) {
      fileErrors.push(`File ${index + 1}: Description exceeds maximum length of ${FILE_SCHEMA.description.maxLength} characters`);
    }

    errors.push(...fileErrors);

    return {
      key: file.key?.trim() || '',
      title: file.title?.trim() || '',
      description: file.description?.trim() || '',
      url: file.url?.trim() || '',
      name: file.name?.trim() || '',
      type: file.type?.trim().toLowerCase() || '',
      size: Number(file.size) || 0
    };
  });

  return { validatedFiles, errors };
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeFileName(name) {
  // Remove or replace potentially dangerous characters
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .slice(0, FILE_SCHEMA.name.maxLength);
}

export async function savePageFiles(files) {
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
    const { validatedFiles, errors } = validateFilesData(files);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Sanitize email for database query
    const userEmail = session.user.email.trim().toLowerCase();

    // Additional processing: sanitize file names
    const processedFiles = validatedFiles.map(file => ({
      ...file,
      name: sanitizeFileName(file.name)
    }));

    // Update with proper error handling
    const result = await page.updateOne(
      { owner: userEmail },
      { 
        $set: { 
          files: processedFiles,
          updatedAt: new Date()
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

    return { 
      success: true, 
      message: 'Files updated successfully',
      filesCount: processedFiles.length
    };

  } catch (error) {
    console.error('Error saving page files:', error.message);
    
    // Return user-friendly error messages
    if (error.message.includes('Validation failed')) {
      return { success: false, error: error.message };
    }
    
    if (error.message.includes('Authentication required')) {
      return { success: false, error: 'Потребна е автентификација' };
    }
    
    if (error.message.includes('Page not found')) {
      return { success: false, error: 'Страницата не е пронајдена или немате пристап' };
    }
    
    return { 
      success: false, 
      error: 'Грешка при зачувување на датотеките. Обидете се повторно.' 
    };
  }
}

// Additional helper function to get file statistics
export async function getPageFileStats() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('Authentication required');
    }

    const userEmail = session.user.email.trim().toLowerCase();
    const userPage = await page.findOne({ owner: userEmail }).select('files');
    
    if (!userPage) {
      return { success: false, error: 'Page not found' };
    }

    const files = userPage.files || [];
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const fileTypes = files.reduce((acc, file) => {
      const type = file.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return {
      success: true,
      stats: {
        totalFiles: files.length,
        totalSize: totalSize,
        maxFiles: MAX_FILES_COUNT,
        maxFileSize: MAX_FILE_SIZE,
        fileTypes: fileTypes,
        allowedTypes: ALLOWED_FILE_TYPES
      }
    };

  } catch (error) {
    console.error('Error getting file stats:', error.message);
    return { 
      success: false, 
      error: 'Failed to get file statistics' 
    };
  }
}