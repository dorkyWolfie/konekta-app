import { model, models, Schema} from "mongoose";

const ContactSchema = new Schema({
  contactName: {type: String, required: true},
  contactLastName: {type: String, required: true},
  contactCompany: {type: String, default: ''},
  contactPosition: {type: String, default: ''},
  contactEmail: {type: String, required: true},
  contactPhone: {type: String, default: ''},
  targetPageUri: {type: String, required: true}, // The page where the contact was submitted
  targetPageOwner: {type: String, required: true}, // The owner of the target page
}, {timestamps: true});

export const contact = models?.contact || model("contact", ContactSchema);
