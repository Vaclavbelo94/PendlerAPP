
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface AIInsights {
  key: string;
  description: string;
  enabled: boolean;
  confidence?: number;
}

interface AIInsightsWithMethods {
  insights: AIInsights[];
  isLoading: boolean;
  error: string | null;
  models: any[];
  isGeneratingInsights: boolean;
  generateInsights: () => Promise<void>;
  getInsightsByType: (type: string) => AIInsights[];
  getHighImpactInsights: () => AIInsights[];
  getActionableInsights: () => AIInsights[];
}

export const useAIInsights = (): AIInsightsWithMethods => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsights[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

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

  const generateInsights = async () => {
    setIsGeneratingInsights(true);
    // Mock insight generation
    setTimeout(() => {
      setIsGeneratingInsights(false);
      toast.success('Insights generated successfully');
    }, 2000);
  };

  const getInsightsByType = (type: string) => {
    return insights.filter(insight => insight.key.includes(type));
  };

  const getHighImpactInsights = () => {
    return insights.filter(insight => (insight.confidence || 0) > 0.8);
  };

  const getActionableInsights = () => {
    return insights.filter(insight => insight.enabled);
  };

  return {
    insights,
    isLoading,
    error,
    models: [], // Mock models array
    isGeneratingInsights,
    generateInsights,
    getInsightsByType,
    getHighImpactInsights,
    getActionableInsights,
  };
};
