
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; url?: string }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
