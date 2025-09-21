
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const canAccessAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // Use the new permission function instead of localStorage
    const { data: permissionLevel } = await supabase.rpc('get_user_permission_level');
    return permissionLevel && permissionLevel !== 'user';
  } catch (error) {
    console.error('Error checking admin access:', error);
    
    // Fallback to localStorage for backwards compatibility
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    return adminLoggedIn;
  }
};

export const isAdminUser = (email: string | undefined): boolean => {
  if (!email) return false;
  
  const adminEmails = [
    'admin@pendlerapp.com',
    'uzivatel@pendlerapp.com'
  ];
  
  return adminEmails.includes(email.toLowerCase());
};
