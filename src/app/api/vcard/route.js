// vcard for download - grabs info form user & page - converts from cyrilic to latin
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { NextResponse } from 'next/server';
import { page } from '@/models/page';
import { user } from '@/models/user';
import { getLocalizedContent } from '@/lib/i18n';

export function cyrillicToLatin(text) {
  const map = {
    'А': 'A',  'а': 'a',
    'Б': 'B',  'б': 'b',
    'В': 'V',  'в': 'v',
    'Г': 'G',  'г': 'g',
    'Д': 'D',  'д': 'd',
    'Ѓ': 'Gj', 'ѓ': 'gj',
    'Е': 'E',  'е': 'e',
    'Ж': 'Zh', 'ж': 'zh',
    'З': 'Z',  'з': 'z',
    'Ѕ': 'Dz', 'ѕ': 'dz',
    'И': 'I',  'и': 'i',
    'Ј': 'J',  'ј': 'j',
    'К': 'K',  'к': 'k',
    'Л': 'L',  'л': 'l',
    'Љ': 'Lj', 'љ': 'lj',
    'М': 'M',  'м': 'm',
    'Н': 'N',  'н': 'n',
    'Њ': 'Nj', 'њ': 'nj',
    'О': 'O',  'о': 'o',
    'П': 'P',  'п': 'p',
    'Р': 'R',  'р': 'r',
    'С': 'S',  'с': 's',
    'Т': 'T',  'т': 't',
    'Ќ': 'Kj', 'ќ': 'kj',
    'У': 'U',  'у': 'u',
    'Ф': 'F',  'ф': 'f',
    'Х': 'H',  'х': 'h',
    'Ц': 'C',  'ц': 'c',
    'Ч': 'Ch', 'ч': 'ch',
    'Џ': 'Dzh','џ': 'dzh',
    'Ш': 'Sh', 'ш': 'sh',
  };

  return text.split('').map(char => map[char] || char).join('');
}

async function getBase64Image(imageUrl) {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  const base64 = Buffer.from(buffer).toString('base64');
  return `PHOTO;ENCODING=b;TYPE=${mimeType.split('/')[1].toUpperCase()}:${base64}`;
}

// Helper function to get button value by type
function getButtonValue(buttons, buttonType) {
  if (!buttons || !Array.isArray(buttons)) return null;
  
  const button = buttons.find(btn => 
    btn.isActive && 
    btn.value && 
    btn.value.trim() !== '' && 
    btn.type === buttonType
  );
  
  return button ? button.value.trim() : null;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uri = searchParams.get('uri');
  const lang = searchParams.get('lang') === 'en' ? 'en' : 'mk';

  if (!uri) {
    return new NextResponse('Missing uri parameter', { status: 400 });
  }

  await mongoose.connect(process.env.MONGO_URI);
  const Page = await page.findOne({ uri });
  const User = await user.findOne({ email: Page.owner });

  if (!Page) {
    return new NextResponse('Page not found', { status: 404 });
  }

  // Get localized content based on language selection
  const content = getLocalizedContent(Page, lang);

  // For English, use content as-is if available, for Macedonian convert to Latin
  const displayName = lang === 'en' && content.displayName !== Page.displayName
    ? content.displayName
    : cyrillicToLatin(content.displayName || '');
  const company = lang === 'en' && content.company !== Page.company
    ? content.company
    : cyrillicToLatin(content.company || '');
  const position = lang === 'en' && content.position !== Page.position
    ? content.position
    : cyrillicToLatin(content.position || '');

  // Use localized buttons from content
  const buttons = content.buttons || [];

  // Extract only phone and email from buttons
  const emailValue = getButtonValue(buttons, 'email');
  const phoneValue = getButtonValue(buttons, 'phone');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${displayName.split(' ').reverse().join(';')}`,
    `FN:${displayName}`,
    company ? `ORG:${company}` : '',
    position ? `TITLE:${position}` : '',
    phoneValue ? `TEL;TYPE=CELL:${phoneValue}` : '',
    emailValue ? `EMAIL:${emailValue}` : '',
    `URL:${process.env.NEXTAUTH_URL}/${uri}`,
  ];

  // Add photo
  if (User.image) {
    try {
      const photoLine = await getBase64Image(User.image);
      lines.push(photoLine);
    } catch (e) {
      console.warn("Image fetch failed:", e);
    }
  }

  lines.push('END:VCARD');

  const vCardString = lines.filter(Boolean).join('\r\n');

  return new NextResponse(vCardString, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${displayName}.vcf"`,
    },
  });
}