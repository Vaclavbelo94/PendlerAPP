
/**
 * Utility functions for authentication management and localStorage cleanup
 */

/**
 * Checks available localStorage space
 */
export const checkLocalStorageSpace = (): number => {
  try {
    const testKey = 'test_storage_space';
    const testData = 'x'.repeat(1024); // 1KB test
    let availableSpace = 0;
    
    // Test how much space we can use
    for (let i = 0; i < 10000; i++) {
      try {
        localStorage.setItem(testKey + i, testData);
        availableSpace += 1024;
      } catch (e) {
        // Clean up test data
        for (let j = 0; j <= i; j++) {
          localStorage.removeItem(testKey + j);
        }
        break;
      }
    }
    
    return availableSpace;
  } catch (error) {
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
export const cleanupAuthState = () => {
  try {
    console.log('Starting auth state cleanup...');
    
    // Remove all Supabase auth keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('userSessions') || key.startsWith('errorReports')) {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Could not remove localStorage key: ${key}`, error);
        }
      }
    });
    
    // Remove specific problematic keys
    const problematicKeys = [
      'supabase.auth.token',
      'currentUser',
      'adminLoggedIn',
      'vocabulary_items',
      'userSessions',
      'errorReports',
      'performanceMetrics'
    ];
    
    problematicKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Could not remove key ${key}:`, error);
      }
    });
    
    console.log('Auth state cleanup completed');
  } catch (error) {
    console.warn('Error during auth cleanup:', error);
    // If regular cleanup fails, try aggressive cleanup
    aggressiveCleanup();
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
export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, cleaning up...');
      cleanupAuthState();
      
      // Try once more after cleanup
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Failed to save after cleanup:', retryError);
        return false;
      }
    }
    console.error('Error saving to localStorage:', error);
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
