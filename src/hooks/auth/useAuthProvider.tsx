
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';
import { AuthContextType, AuthError, UnifiedUser } from '@/types/auth';
import { useOptimizedAuth } from './useOptimizedAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const optimizedAuth = useOptimizedAuth();
  
  console.log('Auth Provider: Using optimized auth, state:', {
    hasUser: !!optimizedAuth.user,
    email: optimizedAuth.user?.email,
    isPremium: optimizedAuth.isPremium,
    isAdmin: optimizedAuth.isAdmin,
    isLoading: optimizedAuth.isLoading
  });

  // Use optimized auth directly as it implements AuthContextType
  const contextValue: AuthContextType = optimizedAuth;

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
