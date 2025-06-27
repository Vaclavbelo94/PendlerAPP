
import * as React from 'react';
import { AuthProvider } from './useAuthProvider';
import { useAuthContext } from './useAuthContext';

// Export the hook with the correct name
export const useAuth = useAuthContext;

// Export the provider
export { AuthProvider };

// Also export useAuthContext directly for compatibility
export { useAuthContext };
