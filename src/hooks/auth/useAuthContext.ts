
import { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UnifiedUser } from '@/contexts/UnifiedAuthContext';

export interface UnifiedAuthContextType {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; url?: string }>;
  signUp: (email: string, password: string, username?: string, promoCode?: string) => Promise<{ error: string | null; user?: User }>;
  signOut: () => Promise<void>;
  
  // Status methods
  refreshUserData: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  
  // Access methods
  canAccess: (feature: string) => boolean;
}

export const AuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);
