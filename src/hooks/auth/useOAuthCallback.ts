
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
        
        // Parse hash parameters directly
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const oauthError = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (oauthError) {
          console.error('OAuth error in hash:', oauthError, errorDescription);
          toast.error(`Chyba při přihlašování: ${errorDescription || oauthError}`);
          // Clean up URL and redirect to login
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/login', { replace: true });
          return;
        }
        
        if (accessToken) {
          console.log('OAuth access token found, setting session...');
          
          // Set the session with the tokens from URL
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (setSessionError) {
            console.error('Error setting session:', setSessionError);
            toast.error('Chyba při zpracování přihlášení');
            navigate('/login', { replace: true });
            return;
          }
          
          if (data.session && data.session.user) {
            console.log('OAuth session set successfully:', data.session.user.email);
            toast.success('Úspěšně přihlášeno přes Google');
            
            // Clean up the URL
            window.history.replaceState(null, '', window.location.pathname);
            
            // Navigate to dashboard
            navigate('/dashboard', { replace: true });
            return;
          }
        }
        
        // Fallback: try to get existing session
        console.log('Trying to get existing session...');
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session after OAuth:', sessionError);
          toast.error('Chyba při zpracování přihlášení přes Google');
          navigate('/login', { replace: true });
          return;
        }

        if (data.session && data.session.user) {
          console.log('OAuth session retrieved successfully:', data.session.user.email);
          toast.success('Úspěšně přihlášeno přes Google');
          
          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Navigate to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          console.error('No session after OAuth callback');
          toast.error('Chyba při zpracování přihlášení');
          navigate('/login', { replace: true });
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
