
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContext } from './useAuthContext';
import { AuthContextType, AuthError, UnifiedUser } from '@/types/auth';
import { useUnifiedAuth } from './useUnifiedAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const unifiedAuth = useUnifiedAuth();
  
  console.log('Auth Provider: Using unified auth, state:', {
    hasUser: !!unifiedAuth.user,
    email: unifiedAuth.user?.email,
    isPremium: unifiedAuth.isPremium,
    isAdmin: unifiedAuth.isAdmin,
    isLoading: unifiedAuth.isLoading
  });

  // Transform unified auth to match AuthContextType interface
  const contextValue: AuthContextType = {
    user: unifiedAuth.user,
    session: unifiedAuth.session,
    unifiedUser: unifiedAuth.unifiedUser,
    isLoading: unifiedAuth.isLoading,
    isPremium: unifiedAuth.isPremium,
    isAdmin: unifiedAuth.isAdmin,
    error: null, // Could be enhanced to include error handling
    
    // Auth methods - delegate to unified auth
    signIn: unifiedAuth.signIn,
    signInWithGoogle: unifiedAuth.signInWithGoogle,
    signUp: unifiedAuth.signUp,
    signOut: unifiedAuth.signOut,
    
    // Status methods - wrap to match interface expectations
    refreshUserStatus: async () => {
      await unifiedAuth.refreshUserStatus();
    },
    refreshAdminStatus: unifiedAuth.refreshAdminStatus,
    refreshPremiumStatus: async () => {
      await unifiedAuth.refreshPremiumStatus();
    },
    
    // Role methods - delegate to unified auth
    hasRole: unifiedAuth.hasRole,
    canAccess: unifiedAuth.canAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
