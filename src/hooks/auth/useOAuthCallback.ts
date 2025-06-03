
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we have auth tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      if (accessToken) {
        try {
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session:', error);
            toast.error('Chyba při přihlašování přes Google');
            navigate('/login');
            return;
          }

          if (data.session && data.user) {
            toast.success('Úspěšně přihlášeno přes Google');
            
            // Clean up the URL by removing the hash
            window.history.replaceState(null, '', window.location.pathname);
            
            // Redirect to dashboard
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast.error('Chyba při zpracování přihlášení');
          navigate('/login');
        }
      }
    };

    // Only run if we're on a page with OAuth tokens in the hash
    if (window.location.hash.includes('access_token')) {
      handleOAuthCallback();
    }
  }, [navigate]);
};
