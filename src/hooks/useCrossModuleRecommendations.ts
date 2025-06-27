import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
import { useAuth } from '@/hooks/auth';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  module: string;
  link: string;
}

interface CrossModuleRecommendationsState {
  recommendations: Recommendation[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useCrossModuleRecommendations = () => {
  const { user } = useAuth();
  const [state, setState] = useState<CrossModuleRecommendationsState>({
    recommendations: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        // Fetch recommendations from Supabase table
        const { data, error } = await supabase
          .from('cross_module_recommendations')
          .select('*');

        if (error) {
          throw error;
        }

        setState(prevState => ({
          ...prevState,
          recommendations: data,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error fetching cross-module recommendations:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání doporučení',
          isLoading: false,
        }));
      }
    };

    fetchRecommendations();
  }, [user]);

  return {
    ...state,
  };
};

