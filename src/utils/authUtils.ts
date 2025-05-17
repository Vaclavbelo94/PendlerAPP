
/**
 * Utility functions for authentication management
 */

/**
 * Cleans up all authentication-related state from local storage
 * preventing auth limbo states
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Clean up our custom keys too
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
};

/**
 * Saves user information to localStorage
 */
export const saveUserToLocalStorage = (user: any, isPremium: boolean, premiumExpiry?: string) => {
  const currentUser = {
    id: user.id,
    name: user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel',
    email: user.email,
    isPremium,
    premiumUntil: premiumExpiry
  };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('isLoggedIn', 'true');
};
