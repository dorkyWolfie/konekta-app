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
}, {timestamps: true});

export const page = models?.page || model("page", PageSchema);
