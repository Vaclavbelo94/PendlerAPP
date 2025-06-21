/**
 * Utility functions for authentication management and localStorage cleanup
 */

/**
 * Checks available localStorage space
 */
export const checkLocalStorageSpace = (): number => {
  try {
    let totalSpace = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSpace += localStorage[key].length + key.length;
      }
    }
    return totalSpace;
  } catch (error) {
    console.warn('Failed to check localStorage space:', error);
    return 0;
  }
};

/**
 * Aggressive cleanup of localStorage to free up space
 */
export const aggressiveCleanup = () => {
  try {
    console.log('Starting aggressive localStorage cleanup...');
    
    // List of keys to preserve (only the most essential)
    const preserveKeys = [
      'theme',
      'language',
      'isLoggedIn'
    ];
    
    // Get all keys before starting cleanup
    const allKeys = Object.keys(localStorage);
    let removedCount = 0;
    
    // Remove everything except preserved keys
    allKeys.forEach((key) => {
      if (!preserveKeys.includes(key)) {
        try {
          localStorage.removeItem(key);
          removedCount++;
        } catch (error) {
          console.warn(`Could not remove key: ${key}`, error);
        }
      }
    });
    
    console.log(`Aggressive cleanup completed. Removed ${removedCount} items.`);
    
    // Try to clear any remaining space
    try {
      localStorage.clear();
      console.log('Complete localStorage clear performed.');
    } catch (error) {
      console.warn('Could not perform complete clear:', error);
    }
    
  } catch (error) {
    console.error('Error during aggressive cleanup:', error);
    // Last resort - try to clear everything
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Cannot clear localStorage at all:', clearError);
    }
  }
};

/**
 * Cleans up all authentication-related state from local storage
 */
export const cleanupAuthState = (): void => {
  try {
    const authKeys = ['supabase.auth.token', 'sb-auth-token', 'auth-storage'];
    authKeys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item);
          if (parsed.expires_at && Date.now() > parsed.expires_at * 1000) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // Keep valid auth tokens, remove invalid ones
          if (!item.includes('access_token')) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.warn('Failed to cleanup auth state:', error);
  }
};

/**
 * Saves user information to localStorage with error handling and space management
 */
export const saveUserToLocalStorage = (user: any, isPremium: boolean, premiumExpiry?: string) => {
  try {
    // Check space first
    const availableSpace = checkLocalStorageSpace();
    if (availableSpace < 1024) { // Less than 1KB available
      console.warn('Low localStorage space, cleaning up...');
      cleanupAuthState();
    }
    
    const currentUser = {
      id: user.id,
      name: user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel',
      email: user.email,
      isPremium,
      premiumUntil: premiumExpiry
    };
    
    const userData = JSON.stringify(currentUser);
    
    // Try to save with fallback
    try {
      localStorage.setItem('currentUser', userData);
      localStorage.setItem('isLoggedIn', 'true');
    } catch (quotaError) {
      console.warn('Quota exceeded when saving user, performing cleanup...');
      aggressiveCleanup();
      
      // Try again after cleanup
      try {
        localStorage.setItem('currentUser', userData);
        localStorage.setItem('isLoggedIn', 'true');
      } catch (retryError) {
        console.error('Failed to save user even after cleanup');
      }
    }
    
  } catch (error) {
    console.warn('Could not save user to localStorage:', error);
  }
};

/**
 * Safe localStorage operations with quota handling
 */
export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get localStorage item ${key}:`, error);
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set localStorage item ${key}:`, error);
    return false;
  }
};

export const safeLocalStorageRemove = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove localStorage item ${key}:`, error);
    return false;
  }
};

/**
 * Initialize localStorage cleanup on app start
 */
export const initializeLocalStorageCleanup = () => {
  try {
    const availableSpace = checkLocalStorageSpace();
    console.log(`Available localStorage space: ${availableSpace} bytes`);
    
    if (availableSpace < 5120) { // Less than 5KB available
      console.warn('Low localStorage space detected, performing cleanup...');
      cleanupAuthState();
    }
  } catch (error) {
    console.error('Error initializing localStorage cleanup:', error);
  }
};
