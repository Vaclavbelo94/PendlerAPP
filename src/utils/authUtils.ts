
export const cleanupAuthState = () => {
  try {
    console.log('Cleaning up auth state...');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || 
          key.includes('sb-') || 
          key === 'adminLoggedIn' ||
          key === 'user' ||
          key === 'session') {
        console.log('Removing localStorage key:', key);
        localStorage.removeItem(key);
      }
    });
    
    // Clean sessionStorage if it exists
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || 
            key.includes('sb-') ||
            key === 'adminLoggedIn' ||
            key === 'user' ||
            key === 'session') {
          console.log('Removing sessionStorage key:', key);
          sessionStorage.removeItem(key);
        }
      });
    }
    
    console.log('Auth state cleanup completed');
  } catch (error) {
    console.error('Error during auth cleanup:', error);
  }
};

export const checkLocalStorageSpace = (): number => {
  try {
    const testKey = 'test-storage-space';
    const testValue = 'x'.repeat(1024); // 1KB test
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    return 1024; // Return available space approximation
  } catch (error) {
    return 0;
  }
};

export const saveUserToLocalStorage = (user: any, isPremium: boolean, premiumExpiry?: string) => {
  try {
    const userData = {
      id: user.id,
      email: user.email,
      isPremium,
      premiumExpiry,
      timestamp: Date.now()
    };
    localStorage.setItem('user-data', JSON.stringify(userData));
  } catch (error) {
    console.warn('Could not save user data to localStorage:', error);
  }
};

export const aggressiveCleanup = () => {
  console.log('Performing aggressive cleanup...');
  
  // Clear all localStorage
  try {
    localStorage.clear();
  } catch (e) {
    console.warn('Could not clear localStorage');
  }
  
  // Clear all sessionStorage
  try {
    sessionStorage?.clear();
  } catch (e) {
    console.warn('Could not clear sessionStorage');
  }
  
  // Clear cookies if possible
  try {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  } catch (e) {
    console.warn('Could not clear cookies');
  }
};

export const initializeLocalStorageCleanup = () => {
  // Clean up any stale data on app initialization
  const staleKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('supabase.auth.') && 
    !key.includes(window.location.hostname)
  );
  
  staleKeys.forEach(key => {
    console.log('Removing stale auth key:', key);
    localStorage.removeItem(key);
  });
};

export const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Could not set localStorage key ${key}:`, error);
    return false;
  }
};
