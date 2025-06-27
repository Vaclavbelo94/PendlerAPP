
import { User, Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  code?: string;
}

export enum UserRole {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  DHL_EMPLOYEE = 'dhl_employee',
  ADMIN = 'admin',
  DHL_ADMIN = 'dhl_admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING_SETUP = 'pending_setup',
  SUSPENDED = 'suspended'
}

export interface UnifiedUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isPremium: boolean;
  isAdmin: boolean;
  isDHLEmployee: boolean;
  isDHLAdmin: boolean;
  premiumExpiry?: string;
  setupRequired?: boolean;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  unifiedUser: UnifiedUser | null;
  isLoading: boolean;
  error?: AuthError | null;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{error: AuthError | string | null}>;
  signInWithGoogle: () => Promise<{error: AuthError | string | null, url?: string}>;
  signUp: (email: string, password: string, username?: string, promoCode?: string) => Promise<{error: AuthError | string | null, user: User | null}>;
  signOut: () => Promise<void>;
  
  // Status refresh methods
  refreshUserStatus: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
  refreshPremiumStatus: () => Promise<{ isPremium: boolean; premiumExpiry?: string }>;
  
  // Role checking methods
  hasRole: (role: UserRole) => boolean;
  canAccess: (requiredRole: UserRole) => boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
