import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface AIInsights {
  key: string;
  description: string;
  enabled: boolean;
}

export const useAIInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsights[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('ai_insights')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setInsights(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load AI Insights');
        toast.error(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIInsights();
  }, [user]);

  return {
    insights,
    isLoading,
    error,
  };
};

