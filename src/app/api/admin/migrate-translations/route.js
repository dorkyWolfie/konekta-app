import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { page } from '@/models/page';

// One-time migration: moves all flat-field content into the `translations` map.
// Protected by MIGRATION_SECRET env var — hit once then it's done.
// GET /api/admin/migrate-translations?secret=<MIGRATION_SECRET>
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (!secret || secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await mongoose.connect(process.env.MONGO_URI);
  const pages = await page.find({}).lean();

  let migrated = 0;
  let skipped = 0;
  const errors = [];

  for (const p of pages) {
    try {
      const existingTranslations = (p.translations && typeof p.translations === 'object')
        ? { ...p.translations }
        : {};

      // --- Page-level content ---

      // Primary (MK) content: only migrate if not already in translations.mk
      if (!existingTranslations.mk || !Object.values(existingTranslations.mk).some(v => v)) {
        existingTranslations.mk = {
          displayName: p.displayName || '',
          company: p.company || '',
          position: p.position || '',
          location: p.location || '',
          bio: p.bio || '',
        };
      }

      // English content: from _en fields, only if showEnglishTranslation is true
      if (p.showEnglishTranslation && (!existingTranslations.en || !Object.values(existingTranslations.en).some(v => v))) {
        existingTranslations.en = {
          displayName: p.displayName_en || '',
          company: p.company_en || '',
          position: p.position_en || '',
          location: p.location_en || '',
          bio: p.bio_en || '',
        };
      }

      // --- Nested items (links, buttons, files) ---

      const migratedLinks = (p.links || []).map(link => {
        const itemTrans = { ...(link.translations || {}) };
        if (p.showEnglishTranslation && !itemTrans.en && (link.title_en || link.subtitle_en)) {
          itemTrans.en = {
            title: link.title_en || '',
            subtitle: link.subtitle_en || '',
          };
        }
        return { ...link, translations: itemTrans };
      });

      const migratedButtons = (p.buttons || []).map(button => {
        const itemTrans = { ...(button.translations || {}) };
        if (p.showEnglishTranslation && !itemTrans.en && button.title_en) {
          itemTrans.en = { title: button.title_en || '' };
        }
        return { ...button, translations: itemTrans };
      });

      const migratedFiles = (p.files || []).map(file => {
        const itemTrans = { ...(file.translations || {}) };
        if (p.showEnglishTranslation && !itemTrans.en && (file.title_en || file.description_en)) {
          itemTrans.en = {
            title: file.title_en || '',
            description: file.description_en || '',
          };
        }
        return { ...file, translations: itemTrans };
      });

      // --- enabledLanguages ---
      // Always includes 'mk'. Adds 'en' if had English. Keeps any extra langs already there.
      const currentEnabled = Array.isArray(p.enabledLanguages) ? [...p.enabledLanguages] : [];
      if (!currentEnabled.includes('mk')) currentEnabled.unshift('mk');
      if (p.showEnglishTranslation && !currentEnabled.includes('en')) currentEnabled.push('en');

      await page.updateOne(
        { _id: p._id },
        {
          $set: {
            primaryLanguage: 'mk',
            translations: existingTranslations,
            enabledLanguages: currentEnabled,
            links: migratedLinks,
            buttons: migratedButtons,
            files: migratedFiles,
          },
        }
      );

      migrated++;
    } catch (err) {
      errors.push({ uri: p.uri, error: err.message });
    }
  }

  return NextResponse.json({
    total: pages.length,
    migrated,
    skipped,
    errors,
  });
}
