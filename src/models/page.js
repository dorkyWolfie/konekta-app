import { model, models, Schema} from "mongoose";

const PageSchema = new Schema({
    uri: {type: String, required: true, min: 1, unique: true},
    owner: {type: String, required: true},
    displayName: {type: String, default: ''},
    company: {type: String, default: ''},
    position: {type: String, default: ''},
    location: {type: String, default: ''},
    bio: {type: String, default: ''},
    bgType: {type: String, default: 'color'},
    bgColor: {type: String, default: '#d1d5db'},
    bgColorPage: {type: String, default: '#F0F9FF'},
    bgImage: {type: String, default: ''},
    buttons: {type: Object, default: []},
    links: {type: Object, default: []},
    files: {type: Object, default: []},
    // English translations (optional)
    displayName_en: {type: String, default: ''},
    company_en: {type: String, default: ''},
    position_en: {type: String, default: ''},
    location_en: {type: String, default: ''},
    bio_en: {type: String, default: ''},
    links_en: {type: Object, default: []},
    files_en: {type: Object, default: []},
    // Translation settings
    showEnglishTranslation: {type: Boolean, default: false},
    // Multi-language translations (for languages other than EN, which uses _en fields)
    translations: {type: Object, default: {}},
    // Tracks which language codes the user has added as translations
    enabledLanguages: {type: [String], default: []},
    // The language the base fields (displayName, bio, etc.) are written in. Defaults to 'mk'.
    primaryLanguage: {type: String, default: 'mk'},
}, {timestamps: true});

export const page = models?.page || model("page", PageSchema);
