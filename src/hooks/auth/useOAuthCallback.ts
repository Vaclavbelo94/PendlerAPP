
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuth callback handler started');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        console.log('URL search params:', window.location.search);
        
        // Check if we're processing an OAuth callback
        const currentUrl = window.location.href;
        const hasOAuthParams = currentUrl.includes('access_token') || 
                              currentUrl.includes('error') ||
                              window.location.hash.includes('access_token') ||
                              window.location.search.includes('access_token');
        
        if (!hasOAuthParams) {
          return;
        }
        
        console.log('OAuth callback detected, processing...');
        
        // Use Supabase's built-in session handling for OAuth callbacks
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session after OAuth:', error);
          toast.error('Chyba při zpracování přihlášení přes Google');
          navigate('/login', { replace: true });
          return;
        }

        if (data.session && data.user) {
          console.log('OAuth session retrieved successfully:', data.user.email);
          toast.success('Úspěšně přihlášeno přes Google');
          
          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Navigate to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // If no session, try to handle the hash parameters manually
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');
          
          if (error) {
            console.error('OAuth error in hash:', error, errorDescription);
            toast.error(`Chyba při přihlašování: ${errorDescription || error}`);
            navigate('/login', { replace: true });
            return;
          }
          
          // Wait a bit for Supabase to process the tokens
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            
            if (retryData.session && retryData.user) {
              console.log('OAuth session retrieved on retry:', retryData.user.email);
              toast.success('Úspěšně přihlášeno přes Google');
              window.history.replaceState(null, '', window.location.pathname);
              navigate('/dashboard', { replace: true });
            } else {
              console.error('No session after OAuth callback');
              toast.error('Chyba při zpracování přihlášení');
              navigate('/login', { replace: true });
            }
          }, 1000);
        }
      } catch (error) {
        console.error('OAuth callback exception:', error);
        toast.error('Chyba při zpracování přihlášení');
        navigate('/login', { replace: true });
      }
    };

    // Only run if we're on the register/login page and have OAuth parameters
    const isAuthPage = window.location.pathname === '/register' || window.location.pathname === '/login';
    const hasOAuthData = window.location.href.includes('access_token') || 
                        window.location.href.includes('error') ||
                        window.location.hash.includes('access_token') ||
                        window.location.search.includes('access_token');
    
    if (isAuthPage && hasOAuthData) {
      console.log('OAuth data detected on auth page, processing callback...');
      handleOAuthCallback();
    }
  }, [navigate]);
};
