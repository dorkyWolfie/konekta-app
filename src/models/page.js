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
}, {timestamps: true});

export const page = models?.page || model("page", PageSchema);
