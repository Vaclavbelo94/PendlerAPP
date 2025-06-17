
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
