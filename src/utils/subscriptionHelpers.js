/**
 * Get the effective subscription status for a user
 * @param {Object} user - User object from database or session
 * @returns {string} - 'pro' or 'basic'
 */
export function getEffectiveSubscription(user) {
  if (!user) return 'basic';
  
  // If user is on trial and trial hasn't expired, they have pro access
  if (user.isOnTrial && user.trialEndsAt && new Date() < new Date(user.trialEndsAt)) {
    return 'pro';
  }
  
  // Otherwise return their actual subscription status
  return user.subscriptionStatus || 'basic';
}

/**
 * Check if user has pro access (including trial)
 * @param {Object} user - User object from database or session
 * @returns {boolean}
 */
export function hasProAccess(user) {
  return getEffectiveSubscription(user) === 'pro';
}

/**
 * Get days remaining in trial
 * @param {Object} user - User object from database or session
 * @returns {number} - Days remaining or 0 if not on trial
 */
export function getTrialDaysRemaining(user) {
  if (!user?.isOnTrial || !user?.trialEndsAt) return 0;
  
  const now = new Date();
  const trialEnd = new Date(user.trialEndsAt);
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}