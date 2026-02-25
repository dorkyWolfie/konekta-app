'use server';
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { page } from "@/models/page";
import { user } from "@/models/user";
import { contact } from "@/models/contact";
import { sendNewContactNotification } from "@/utils/contactNotifications";

function validateInput(key, value) {
  const maxLengths = {
    contactName: 100,
    contactLastName: 100,
    contactCompany: 100,
    contactPosition: 100,
    contactEmail: 100,
    contactPhone: 20 // e.g. +389 70 123 456
  };

  if (maxLengths[key] && value.length > maxLengths[key]) {
    return { isValid: false };
  }

  return { isValid: true, value: value };
}

export async function saveExchangeContact(formData) {
  try {
    // Verify Turnstile token
    const cfToken = formData.get('cfToken');
    if (!cfToken) return false;

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: cfToken,
      }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) return false;

    await mongoose.connect(process.env.MONGO_URI);
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return false;
    }

    // Get target page URI from form data
    const targetPageUri = formData.get('targetPageUri');
    if (!targetPageUri) {
      console.log('Missing target page URI');
      return false;
    }

    // Verify the target page exists
    const targetPage = await page.findOne({ uri: targetPageUri });
    if (!targetPage) {
      console.log('Target page not found:', targetPageUri);
      return false;
    }

    // Get owner's email and name
    const owner = await user.findOne({ email: targetPage.owner }).select('email name _id');
    if (!owner) {
      console.log('Page owner not found');
      return false;
    }

    const dataKeys = [
      'contactName', 'contactLastName', 'contactCompany', 'contactPosition', 'contactEmail', 'contactPhone'
    ];
    const contactData = {
      targetPageUri: targetPageUri,
      targetPageOwner: targetPage.owner,
    };

    for (const key of dataKeys) {
      if (formData.has(key)) {
        const rawValue = formData.get(key);
        const validationResult = validateInput(key, rawValue);

        if (!validationResult.isValid) {
          console.log(`Invalid input for ${key}:`, rawValue);
          return false;
        }

        contactData[key] = validationResult.value !== undefined ? validationResult.value : rawValue;
      }
    }

    // Validate required fields
    if (!contactData.contactName || !contactData.contactLastName || !contactData.contactEmail) {
      console.log('Missing required fields');
      return false;
    }

    // Create new contact entry
    await contact.create(contactData);

    // Send email notification to page owner
    await sendNewContactNotification({
      ownerEmail: owner.email,
      ownerName: owner.name,
      contactName: contactData.contactName,
      contactLastName: contactData.contactLastName,
      contactCompany: contactData.contactCompany,
      contactPosition: contactData.contactPosition,
      contactEmail: contactData.contactEmail,
      contactPhone: contactData.contactPhone,
      targetPageUri: targetPageUri
    });

    return true;
  } catch (error) {
    console.error('Error saving exchange contact:', error);
    return false;
  }
}

export async function getContactsForPageOwner(pageOwner) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const contacts = await contact.find({ targetPageOwner: pageOwner })
      .sort({ createdAt: -1 });

    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
}

export async function getContactsForPage(pageUri) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const contacts = await contact.find({ targetPageUri: pageUri })
      .sort({ createdAt: -1 });

    return contacts;
  } catch (error) {
    console.error('Error fetching contacts for page:', error);
    return [];
  }
}