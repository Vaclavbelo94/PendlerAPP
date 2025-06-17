
// Optimalized authentication utilities
export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set localStorage key "${key}":`, error);
    return false;
  }
};

export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get localStorage key "${key}":`, error);
    return null;
  }
};

export const checkLocalStorageSpace = (): number => {
  try {
    const testKey = '__storage_test__';
    const testValue = '0'.repeat(1024); // 1KB test
    
    let size = 0;
    for (let i = 0; i < 1024; i++) { // Test up to 1MB
      try {
        localStorage.setItem(testKey + i, testValue);
        size += 1024;
      } catch {
        break;
      }
    }
    
    // Cleanup test keys
    for (let i = 0; i < 1024; i++) {
      localStorage.removeItem(testKey + i);
    }
    
    return size;
  } catch {
    return 0;
  }
};

export const cleanupAuthState = (): void => {
  try {
    const keysToClean = [
      'vocabulary',
      'oldPerformanceMetrics',
      'tempData'
    ];
    
    keysToClean.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Auth state cleanup completed');
  } catch (error) {
    console.warn('Auth state cleanup failed:', error);
  }
};

export const saveUserToLocalStorage = (user: any, isPremium: boolean, premiumExpiry?: string): void => {
  try {
    const userData = {
      id: user.id,
      email: user.email,
      isPremium,
      premiumUntil: premiumExpiry,
      lastUpdated: Date.now()
    };
    
    safeLocalStorageSet('currentUser', JSON.stringify(userData));
  } catch (error) {
    console.warn('Failed to save user to localStorage:', error);
  }
};

export const aggressiveCleanup = (): void => {
  try {
    // Remove all auth-related keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || 
          key === 'adminLoggedIn' || key === 'currentUser') {
        localStorage.removeItem(key);
      }
    });
    
    // Also clean session storage
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('Aggressive cleanup completed');
  } catch (error) {
    console.warn('Aggressive cleanup failed:', error);
  }
};

export const initializeLocalStorageCleanup = (): void => {
  try {
    // Check storage space and clean if necessary
    const availableSpace = checkLocalStorageSpace();
    if (availableSpace < 2048) { // Less than 2MB
      console.log('Low storage space detected, running cleanup...');
      cleanupAuthState();
    }
    
    // Set up periodic cleanup (every 30 minutes)
    setInterval(() => {
      cleanupAuthState();
    }, 30 * 60 * 1000);
  } catch (error) {
    console.warn('Failed to initialize localStorage cleanup:', error);
  }
};
