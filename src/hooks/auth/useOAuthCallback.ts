
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
        
        // Handle both hash and search params for OAuth
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Check for access token in hash first (standard OAuth flow)
        let accessToken = hashParams.get('access_token');
        let refreshToken = hashParams.get('refresh_token');
        let tokenType = hashParams.get('token_type');
        let error = hashParams.get('error');
        let errorDescription = hashParams.get('error_description');
        
        // If not in hash, check search params
        if (!accessToken) {
          accessToken = searchParams.get('access_token');
          refreshToken = searchParams.get('refresh_token');
          tokenType = searchParams.get('token_type');
          error = searchParams.get('error');
          errorDescription = searchParams.get('error_description');
        }
        
        console.log('OAuth tokens found:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          tokenType, 
          error, 
          errorDescription 
        });
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          toast.error(`Chyba při přihlašování: ${errorDescription || error}`);
          navigate('/login', { replace: true });
          return;
        }
        
        if (accessToken && tokenType) {
          console.log('Setting OAuth session with tokens');
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Error setting OAuth session:', sessionError);
            toast.error('Chyba při zpracování přihlášení přes Google');
            navigate('/login', { replace: true });
            return;
          }

          if (data.session && data.user) {
            console.log('OAuth session set successfully:', data.user.email);
            toast.success('Úspěšně přihlášeno přes Google');
            
            // Clean up the URL
            window.history.replaceState(null, '', window.location.pathname);
            
            // Navigate to dashboard
            navigate('/dashboard', { replace: true });
          } else {
            console.error('No session or user after setting session');
            toast.error('Chyba při zpracování přihlášení');
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error('OAuth callback exception:', error);
        toast.error('Chyba při zpracování přihlášení');
        navigate('/login', { replace: true });
      }
    };

    // Check if we have OAuth data in URL
    const hasOAuthData = window.location.hash.includes('access_token') || 
                        window.location.search.includes('access_token') || 
                        window.location.hash.includes('error') || 
                        window.location.search.includes('error');
    
    if (hasOAuthData) {
      console.log('OAuth data detected in URL, processing callback...');
      handleOAuthCallback();
    }
  }, [navigate]);
};
