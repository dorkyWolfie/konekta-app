import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  emailVerified: Date,
  subscriptionStatus: { type: String, enum: ['basic', 'pro'], default: 'pro'},
  subscriptionExpiresAt: Date,
  trialEndsAt: Date,
  isOnTrial: { type: Boolean, default: false },
  provider: { type: String, enum: ['google', 'credentials'], required: true, default: 'credentials' },
  // Google-specific fields
  googleId: String,
  // Track registration vs sign-in
  isNewUser: { type: Boolean, default: true },
  lastLoginAt: Date,
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ trialEndsAt: 1 });

// Pre-save middleware to set isNewUser to false after first save
UserSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.isNewUser = false;
  }
  next();
});

export const user = models?.user || model("user", UserSchema);