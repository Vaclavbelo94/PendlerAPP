
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('OAuth callback handler started');
      console.log('Current URL:', window.location.href);
      console.log('URL hash:', window.location.hash);
      
      // Check if we have auth tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const tokenType = hashParams.get('token_type');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      console.log('OAuth tokens found:', { accessToken: !!accessToken, refreshToken: !!refreshToken, tokenType, error, errorDescription });
      
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        toast.error(`Chyba při přihlašování: ${errorDescription || error}`);
        navigate('/login');
        return;
      }
      
      if (accessToken && tokenType) {
        try {
          console.log('Setting OAuth session with tokens');
          
          // Set the session using the tokens from the URL
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Error setting OAuth session:', sessionError);
            toast.error('Chyba při zpracování přihlášení přes Google');
            navigate('/login');
            return;
          }

          if (data.session && data.user) {
            console.log('OAuth session set successfully:', data.user.email);
            toast.success('Úspěšně přihlášeno přes Google');
            
            // Clean up the URL by removing the hash
            window.history.replaceState(null, '', window.location.pathname);
            
            // Small delay to ensure auth state is updated
            setTimeout(() => {
              navigate('/dashboard');
            }, 100);
          }
        } catch (error) {
          console.error('OAuth callback exception:', error);
          toast.error('Chyba při zpracování přihlášení');
          navigate('/login');
        }
      }
    };

    // Only run if we're on a page with OAuth tokens in the hash
    if (window.location.hash.includes('access_token') || window.location.hash.includes('error')) {
      handleOAuthCallback();
    }
  }, [navigate]); // Add navigate as dependency
};
