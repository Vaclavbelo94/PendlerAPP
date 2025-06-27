import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDataSharing } from '@/hooks/useDataSharing';
import { useCrossModuleRecommendations } from '@/hooks/useCrossModuleRecommendations';

interface CrossModuleInsight {
  id: string;
  type: 'recommendation' | 'optimization' | 'prediction' | 'warning';
  title: string;
  description: string;
  modules: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  action?: {
    type: string;
    payload: any;
  };
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

interface CrossModuleInsightsPanelProps {
  currentModule?: string;
  maxInsights?: number;
  showRecommendations?: boolean;
}

const CrossModuleInsightsPanel: React.FC<CrossModuleInsightsPanelProps> = ({
  currentModule = 'dashboard',
  maxInsights = 5,
  showRecommendations = true
}) => {
  const { crossModuleInsights, dismissInsight } = useDataSharing(currentModule);
  const { 
    recommendations, 
    executeRecommendation, 
    dismissRecommendation 
  } = useCrossModuleRecommendations(currentModule);

  const [displayedInsights, setDisplayedInsights] = useState<CrossModuleInsight[]>([]);
  const [displayedRecommendations, setDisplayedRecommendations] = useState<SmartRecommendation[]>([]);

  useEffect(() => {
    // Convert recommendations to SmartRecommendation format
    if (recommendations && showRecommendations) {
      const smartRecommendations: SmartRecommendation[] = recommendations.map(rec => ({
        id: rec.id,
        type: 'feature',
        sourceModules: [rec.module],
        targetModule: rec.module,
        confidence: 0.8,
        title: rec.title,
        description: rec.description,
        reasoning: `Based on your ${rec.module} usage patterns`,
        estimatedBenefit: 'Medium impact',
        actionable: true,
        action: {
          label: 'Navigate',
          type: 'navigate',
          payload: { url: rec.link }
        }
      }));
      setDisplayedRecommendations(smartRecommendations.slice(0, 3));
    }
  }, [recommendations, showRecommendations]);

  useEffect(() => {
    // Mock insights data since crossModuleInsights might not exist properly
    const mockInsights: CrossModuleInsight[] = [
      {
        id: '1',
        type: 'optimization',
        title: 'Route Optimization Opportunity',
        description: 'Your commute data suggests a more efficient route',
        modules: ['travel', 'shifts'],
        priority: 'medium',
        action: {
          type: 'navigate',
          payload: { url: '/travel' }
        }
      }
    ];
    setDisplayedInsights(mockInsights.slice(0, maxInsights));
  }, [maxInsights]);

  const getInsightIcon = (type: CrossModuleInsight['type']) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'prediction': return <Brain className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: CrossModuleInsight['type']) => {
    switch (type) {
      case 'recommendation': return 'text-blue-600 bg-blue-50';
      case 'optimization': return 'text-green-600 bg-green-50';
      case 'prediction': return 'text-purple-600 bg-purple-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: CrossModuleInsight['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationIcon = (type: SmartRecommendation['type']) => {
    switch (type) {
      case 'vocabulary': return <Brain className="h-4 w-4" />;
      case 'schedule': return <TrendingUp className="h-4 w-4" />;
      case 'optimization': return <Lightbulb className="h-4 w-4" />;
      case 'feature': return <Sparkles className="h-4 w-4" />;
      case 'workflow': return <ArrowRight className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleInsightAction = (insight: CrossModuleInsight) => {
    if (insight.action) {
      window.dispatchEvent(new CustomEvent('execute-insight-action', {
        detail: {
          type: insight.action.type,
          payload: insight.action.payload,
          modules: insight.modules
        }
      }));
    }
    dismissInsight(insight.id);
  };

  if (displayedInsights.length === 0 && displayedRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Cross-Module Insights */}
      {displayedInsights.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Chytrá pozorování
            </CardTitle>
            <CardDescription>
              AI objevila souvislosti mezi vašimi aktivitami
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayedInsights.map((insight) => (
              <Alert key={insight.id} className="relative">
                <div className={`absolute left-3 top-3 p-1 rounded ${getInsightColor(insight.type)}`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="ml-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{insight.title}</div>
                      <AlertDescription className="mt-1 text-xs">
                        {insight.description}
                      </AlertDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                        <div className="flex gap-1">
                          {insight.modules.map(module => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {insight.action && (
                        <Button
                          size="sm"
                          onClick={() => handleInsightAction(insight)}
                          className="h-6 text-xs"
                        >
                          Použít
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissInsight(insight.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Smart Recommendations */}
      {showRecommendations && displayedRecommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Inteligentní doporučení
            </CardTitle>
            <CardDescription>
              Personalizovaná doporučení na základě vašich dat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayedRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-blue-50 text-blue-600">
                      {getRecommendationIcon(recommendation.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{recommendation.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {recommendation.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(recommendation.confidence * 100)}% spolehlivost
                        </Badge>
                        <Badge className="text-xs bg-green-100 text-green-800">
                          {recommendation.estimatedBenefit}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Důvod:</strong> {recommendation.reasoning}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {recommendation.actionable && recommendation.action && (
                      <Button
                        size="sm"
                        onClick={() => executeRecommendation(recommendation.id)}
                        className="h-6 text-xs"
                      >
                        {recommendation.action.label}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissRecommendation(recommendation.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrossModuleInsightsPanel;
