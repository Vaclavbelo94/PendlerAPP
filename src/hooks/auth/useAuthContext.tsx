
import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  code?: string;
}

export interface UnifiedUser {
  id: string;
  email: string | null;
  username?: string;
  role: 'user' | 'admin' | 'dhl_employee';
  status: 'active' | 'setup_required';
  setupRequired: boolean;
  isAdmin: boolean;
  isDHLEmployee: boolean;
  isPremium: boolean;
  premiumExpiry?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{error: AuthError | string | null}>;
  signInWithGoogle: () => Promise<{error: AuthError | string | null, url?: string}>;
  signUp: (email: string, password: string, username?: string) => Promise<{error: AuthError | string | null, user: User | null}>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
