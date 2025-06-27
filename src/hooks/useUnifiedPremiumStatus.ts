import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface UnifiedPremiumStatus {
  isPremium: boolean | null;
  isLoading: boolean;
  error: string | null;
}

export const useUnifiedPremiumStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<UnifiedPremiumStatus>({
    isPremium: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkPremiumStatus = async () => {
      if (!user?.id) {
        if (isMounted) {
          setStatus({ isPremium: false, isLoading: false, error: null });
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching premium status:', error);
          if (isMounted) {
            setStatus({ isPremium: false, isLoading: false, error: error.message });
          }
          return;
        }

        if (isMounted) {
          setStatus({ isPremium: data?.is_premium || false, isLoading: false, error: null });
        }
      } catch (error: any) {
        console.error('Unexpected error checking premium status:', error);
        if (isMounted) {
          setStatus({ isPremium: false, isLoading: false, error: error.message || 'Unknown error' });
        }
      }
    };

    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    checkPremiumStatus();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return status;
};
