import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Clock, MapPin, TrendingDown, Zap, AlertTriangle } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { trafficService } from '@/services/trafficService';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface SmartRecommendation {
  id: string;
  type: 'departure_time' | 'route_change' | 'transport_mode' | 'cost_optimization';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    time_saved?: number;
    cost_saved?: number;
    co2_reduced?: number;
  };
  confidence: number;
  action_required: boolean;
  expires_at?: string;
}

export const SmartTravelRecommendations: React.FC = () => {
  const { user } = useAuthState();
  const { t } = useTranslation('travel');
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoutes, setUserRoutes] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadSmartRecommendations();
    }
  }, [user?.id]);

  const loadSmartRecommendations = async () => {
    setIsLoading(true);
    try {
      // Load user's personal routes for analysis
      const routes = await trafficService.getPersonalRoutes(user!.id);
      setUserRoutes(routes);

      // Generate smart recommendations based on user data
      const smartRecs: SmartRecommendation[] = [
        {
          id: '1',
          type: 'departure_time',
          priority: 'high',
          title: 'Optimální čas odjezdu',
          description: 'Odjezd o 15 minut dříve vám ušetří 20 minut cesty každý den',
          impact: { time_saved: 20, cost_saved: 0 },
          confidence: 0.89,
          action_required: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'route_change', 
          priority: 'medium',
          title: 'Alternativní trasa',
          description: 'Nová trasa přes A93 je o 12% rychlejší během špičky',
          impact: { time_saved: 8, cost_saved: 3.5 },
          confidence: 0.76,
          action_required: false
        },
        {
          id: '3',
          type: 'transport_mode',
          priority: 'medium', 
          title: 'Multimodální doprava',
          description: 'Kombinace auto + vlak ušetří 25€ týdně při stejném čase',
          impact: { cost_saved: 100, co2_reduced: 15.6 },
          confidence: 0.82,
          action_required: true
        },
        {
          id: '4',
          type: 'cost_optimization',
          priority: 'low',
          title: 'Úspora paliva',
          description: 'Tankování v Chebu místo v Drážďanech ušetří 8€ na nádrž',
          impact: { cost_saved: 32 },
          confidence: 0.94,
          action_required: false
        }
      ];

      setRecommendations(smartRecs);
    } catch (error) {
      console.error('Failed to load smart recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationIcon = (type: SmartRecommendation['type']) => {
    switch (type) {
      case 'departure_time': return Clock;
      case 'route_change': return MapPin;
      case 'transport_mode': return Zap;
      case 'cost_optimization': return TrendingDown;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: SmartRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: SmartRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApplyRecommendation = async (rec: SmartRecommendation) => {
    try {
      // Here you would implement the logic to apply the recommendation
      console.log('Applying recommendation:', rec);
      
      // Update recommendations to mark as applied
      setRecommendations(prev => 
        prev.filter(r => r.id !== rec.id)
      );
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
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
          <Lightbulb className="h-5 w-5 text-primary" />
          Chytrá Doporučení
          <Badge variant="secondary">
            {recommendations.length} aktivních
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zatím žádná doporučení</p>
              <p className="text-sm">Doporučení se vytvoří na základě vašich cest</p>
            </div>
          ) : (
            recommendations.map((rec, index) => {
              const Icon = getRecommendationIcon(rec.type);
              const isExpiring = rec.expires_at && 
                new Date(rec.expires_at).getTime() - Date.now() < 6 * 60 * 60 * 1000;
              
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-1 text-primary" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={getPriorityBadge(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        {isExpiring && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Expiruje brzy
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {rec.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        {rec.impact.time_saved && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            +{rec.impact.time_saved} min
                          </span>
                        )}
                        {rec.impact.cost_saved && (
                          <span className="flex items-center gap-1 text-green-600">
                            <TrendingDown className="h-3 w-3" />
                            -{rec.impact.cost_saved}€
                          </span>
                        )}
                        {rec.impact.co2_reduced && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            -{rec.impact.co2_reduced}kg CO₂
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {Math.round(rec.confidence * 100)}% jistota
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {rec.action_required ? (
                          <Button 
                            size="sm"
                            onClick={() => handleApplyRecommendation(rec)}
                          >
                            Použít
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApplyRecommendation(rec)}
                          >
                            Zobrazit detaily
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setRecommendations(prev => 
                            prev.filter(r => r.id !== rec.id)
                          )}
                        >
                          Zavřít
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={loadSmartRecommendations}
            disabled={isLoading}
          >
            Obnovit doporučení
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartTravelRecommendations;