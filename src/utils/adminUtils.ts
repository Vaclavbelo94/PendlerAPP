
import { User } from '@supabase/supabase-js';

export const canAccessAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check localStorage for admin status (set during login)
  const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  return adminLoggedIn;
};

export const isAdminUser = (email: string | undefined): boolean => {
  if (!email) return false;
  
  const adminEmails = [
    'admin@pendlerapp.com',
    'uzivatel@pendlerapp.com'
  ];
  
  return adminEmails.includes(email.toLowerCase());
};
