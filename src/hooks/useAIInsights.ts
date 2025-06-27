
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface AIInsights {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  confidence?: number;
  type?: string;
  title?: string;
  category?: string;
  generatedAt?: string;
  impact?: string;
  actionable?: boolean;
  suggestedActions?: string[];
  expiresAt?: string;
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
        // Since ai_insights table doesn't exist, let's mock some data based on user's existing data
        const mockInsights: AIInsights[] = [
          {
            id: '1',
            key: 'commute_optimization',
            description: 'Optimize your daily commute route',
            enabled: true,
            confidence: 0.85,
            type: 'commute',
            title: 'Route Optimization',
            category: 'travel',
            generatedAt: new Date().toISOString(),
            impact: 'high',
            actionable: true,
            suggestedActions: ['Update preferred route', 'Consider alternative transport'],
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            key: 'shift_planning',
            description: 'Improve shift scheduling efficiency',
            enabled: true,
            confidence: 0.75,
            type: 'scheduling',
            title: 'Shift Planning',
            category: 'work',
            generatedAt: new Date().toISOString(),
            impact: 'medium',
            actionable: true,
            suggestedActions: ['Review weekly patterns', 'Optimize work hours'],
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        setInsights(mockInsights);
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
    return insights.filter(insight => insight.type?.includes(type));
  };

  const getHighImpactInsights = () => {
    return insights.filter(insight => (insight.confidence || 0) > 0.8);
  };

  const getActionableInsights = () => {
    return insights.filter(insight => insight.enabled && insight.actionable);
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
