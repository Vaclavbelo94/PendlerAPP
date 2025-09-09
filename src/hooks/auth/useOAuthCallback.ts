
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
        const hasHashParams = window.location.hash.includes('access_token') || 
                             window.location.hash.includes('error');
        const hasSearchParams = window.location.search.includes('access_token') || 
                               window.location.search.includes('error');
        
        if (!hasHashParams && !hasSearchParams) {
          console.log('No OAuth parameters detected');
          return;
        }
        
        console.log('OAuth callback detected, processing...');
        
        // Parse hash parameters first (primary method)
        let accessToken = null;
        let refreshToken = null;
        let oauthError = null;
        let errorDescription = null;
        
        if (hasHashParams) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
          oauthError = hashParams.get('error');
          errorDescription = hashParams.get('error_description');
        } else if (hasSearchParams) {
          // Fallback to search params
          const searchParams = new URLSearchParams(window.location.search);
          accessToken = searchParams.get('access_token');
          refreshToken = searchParams.get('refresh_token');
          oauthError = searchParams.get('error');
          errorDescription = searchParams.get('error_description');
        }
        
        if (oauthError) {
          console.error('OAuth error:', oauthError, errorDescription);
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
            window.history.replaceState(null, '', window.location.pathname);
            navigate('/login', { replace: true });
            return;
          }
          
          if (data.session && data.session.user) {
            console.log('OAuth session set successfully:', data.session.user.email);
            toast.success('Úspěšně přihlášeno přes Google');
            
            // Clean up the URL
            window.history.replaceState(null, '', window.location.pathname);
            
            // Navigate based on user role
            const { getAdminRedirectPath } = await import('@/utils/authRedirectUtils');
            const adminPath = getAdminRedirectPath(data.session.user);
            const redirectPath = adminPath || '/dashboard';
            console.log('OAuth callback redirecting to:', redirectPath);
            navigate(redirectPath, { replace: true });
            return;
          }
        }
        
        // If no direct token processing worked, try Supabase's built-in session handling
        console.log('Trying Supabase built-in session handling...');
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
          
          // Navigate based on user role
          const { getAdminRedirectPath } = await import('@/utils/authRedirectUtils');
          const adminPath = getAdminRedirectPath(data.session.user);
          const redirectPath = adminPath || '/dashboard';
          console.log('OAuth callback redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
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

    // Check if we're on an auth page (register or login) with OAuth parameters
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
