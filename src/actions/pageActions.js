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
  };
  
  if (maxLengths[key] && value.length > maxLengths[key]) {
    return false;
  }
  
  // Validate color format
  if (key === 'bgColor' && !/^#[0-9A-F]{6}$/i.test(value)) {
    return false;
  }
  
  // Validate URLs
  if ((key === 'bgImage' || key === 'avatar') && value !== 'avatar') {
    try {
      const url = new URL(value);
      if (!url.hostname.includes(process.env.BUCKET_NAME) && !url.hostname.includes("googleusercontent.com")) 
      { return false; }
    } catch {
      return false;
    }
  }
  
  // Basic XSS prevention - strip HTML
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '');
  }
  
  return value;
}

export async function savePageSettings(formData) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return false;
    }

    const dataKeys = ['displayName', 'company', 'position', 'location', 'bio', 'bgType', 'bgColor', 'bgImage'];
    const dataToUpdate = {};
    
    for (const key of dataKeys) {
      if (formData.has(key)) {
        const rawValue = formData.get(key);
        const cleanValue = validateInput(key, rawValue);
        
        if (cleanValue === false) {
          console.log(`Invalid input for ${key}:`, rawValue);
          return false;
        }
        
        dataToUpdate[key] = cleanValue;
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
      const cleanAvatar = validateInput('avatar', avatarLink);
      
      if (cleanAvatar === false) {
        console.log('Invalid avatar URL:', avatarLink);
        return false;
      }

      await user.updateOne(
        { email: session.user.email },
        { $set: { image: cleanAvatar } },
      );
    }

    return true;
  } catch (error) {
    return false;
  }
}