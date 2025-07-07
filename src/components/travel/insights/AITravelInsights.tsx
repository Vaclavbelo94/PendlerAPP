import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Clock, MapPin, Users, Zap } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface TravelInsight {
  id: string;
  type: 'route_optimization' | 'cost_saving' | 'time_optimization' | 'eco_friendly';
  title: string;
  description: string;
  potential_savings: {
    time?: number;
    cost?: number;
    co2?: number;
  };
  confidence: number;
  actionable: boolean;
}

export const AITravelInsights: React.FC = () => {
  const { user } = useAuthState();
  const { t } = useTranslation('travel');
  const [insights, setInsights] = useState<TravelInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    predictions,
    generatePredictions,
    isAnalyzing,
    error
  } = usePredictiveAnalytics(user?.id || '');

  useEffect(() => {
    if (user?.id) {
      loadTravelInsights();
    }
  }, [user?.id]);

  const loadTravelInsights = async () => {
    setIsLoading(true);
    try {
      // Generate AI-powered travel insights
      await generatePredictions();
      
      // Mock insights based on user data
      const mockInsights: TravelInsight[] = [
        {
          id: '1',
          type: 'route_optimization',
          title: t('smartRecommendations'),
          description: 'Změnou trasy přes A6 ušetříte 15 minut každý den',
          potential_savings: { time: 15, cost: 2.5 },
          confidence: 0.85,
          actionable: true
        },
        {
          id: '2', 
          type: 'cost_saving',
          title: t('costOptimized'),
          description: 'Spolujízda s kolegy vám ušetří 120€ měsíčně',
          potential_savings: { cost: 120, co2: 45 },
          confidence: 0.92,
          actionable: true
        },
        {
          id: '3',
          type: 'time_optimization', 
          title: t('timeOptimized'),
          description: 'Odjezd o 10 minut dříve zkrátí dobu cesty o 20%',
          potential_savings: { time: 12 },
          confidence: 0.78,
          actionable: true
        }
      ];
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to load travel insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: TravelInsight['type']) => {
    switch (type) {
      case 'route_optimization': return MapPin;
      case 'cost_saving': return TrendingUp;
      case 'time_optimization': return Clock;
      case 'eco_friendly': return Users;
      default: return Brain;
    }
  };

  const getInsightColor = (type: TravelInsight['type']) => {
    switch (type) {
      case 'route_optimization': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'cost_saving': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'time_optimization': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'eco_friendly': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Cestovní Doporučení
          <Badge variant="secondary" className="ml-2">
            <Zap className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm opacity-80 mb-2">{insight.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      {insight.potential_savings.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {insight.potential_savings.time} min
                        </span>
                      )}
                      {insight.potential_savings.cost && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {insight.potential_savings.cost}€
                        </span>
                      )}
                      {insight.potential_savings.co2 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          -{insight.potential_savings.co2}kg CO₂
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% jistota
                      </Badge>
                    </div>
                  </div>
                  
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Použít
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={loadTravelInsights}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzuji...' : 'Obnovit doporučení'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITravelInsights;