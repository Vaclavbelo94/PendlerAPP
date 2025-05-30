
/**
 * Utility functions for authentication management
 */

/**
 * Cleans up all authentication-related state from local storage
 * preventing auth limbo states and quota exceeded errors
 */
export const cleanupAuthState = () => {
  try {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Could not remove localStorage key: ${key}`, error);
        }
      }
    });
    
    // Clean up our custom keys too
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    
    // Also clean up vocabulary and other app data that might be taking space
    localStorage.removeItem('vocabulary_items');
    
    console.log('Auth state cleaned up successfully');
  } catch (error) {
    console.warn('Error during auth cleanup:', error);
    // If localStorage is completely broken, try to clear everything
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Cannot clear localStorage:', clearError);
    }
  }
};

/**
 * Saves user information to localStorage with error handling
 */
export const saveUserToLocalStorage = (user: any, isPremium: boolean, premiumExpiry?: string) => {
  try {
    const currentUser = {
      id: user.id,
      name: user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel',
      email: user.email,
      isPremium,
      premiumUntil: premiumExpiry
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('isLoggedIn', 'true');
  } catch (error) {
    console.warn('Could not save user to localStorage:', error);
    // Try to free up space by clearing old data
    cleanupAuthState();
  }
};

/**
 * Check if localStorage has enough space
 */
export const checkLocalStorageSpace = (): boolean => {
  try {
    const testKey = 'test_storage_space';
    const testData = 'x'.repeat(1024); // 1KB test
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};
