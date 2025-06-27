
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  module: string;
  link: string;
}

interface SmartRecommendation {
  id: string;
  type: string;
  sourceModules: string[];
  targetModule: string;
  confidence: number;
  title: string;
  description: string;
  reasoning: string;
  estimatedBenefit: string;
  actionable: boolean;
  action?: {
    label: string;
    type: string;
    payload?: any;
  };
}

interface CrossModuleRecommendationsState {
  recommendations: Recommendation[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useCrossModuleRecommendations = (currentModule?: string) => {
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
        // Since cross_module_recommendations table doesn't exist, create mock data
        const mockRecommendations: Recommendation[] = [
          {
            id: '1',
            title: 'Optimize Your Commute',
            description: 'Based on your shift patterns, optimize your daily commute',
            module: 'travel',
            link: '/travel'
          },
          {
            id: '2',
            title: 'Vehicle Maintenance Reminder',
            description: 'Your vehicle inspection is due soon',
            module: 'vehicle',
            link: '/vehicle'
          }
        ];

        setState(prevState => ({
          ...prevState,
          recommendations: mockRecommendations,
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

  const executeRecommendation = async (recommendation: SmartRecommendation | string) => {
    const id = typeof recommendation === 'string' ? recommendation : recommendation.id;
    console.log('Executing recommendation:', id);
    toast.success('Doporučení bylo provedeno');
  };

  const dismissRecommendation = async (id: string) => {
    setState(prevState => ({
      ...prevState,
      recommendations: prevState.recommendations?.filter(rec => rec.id !== id) || null
    }));
    toast.success('Doporučení bylo odmítnuto');
  };

  return {
    ...state,
    executeRecommendation,
    dismissRecommendation,
  };
};
