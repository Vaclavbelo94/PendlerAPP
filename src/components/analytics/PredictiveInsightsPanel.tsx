
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
  Clock,
  Target,
  Zap,
  ChevronRight,
  X
} from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';

type InsightType = 'learning_trend' | 'performance_prediction' | 'optimization_suggestion' | 'behavioral_pattern';
type ImpactLevel = 'high' | 'medium' | 'low';

interface PredictiveInsightsPanelProps {
  module?: string;
  maxInsights?: number;
}

const PredictiveInsightsPanel: React.FC<PredictiveInsightsPanelProps> = ({
  module = 'dashboard',
  maxInsights = 5
}) => {
  const {
    insights,
    isLoading,
    error,
    models,
    isGeneratingInsights,
    generateInsights,
    getInsightsByType,
    getHighImpactInsights,
    getActionableInsights,
  } = useAIInsights();

  const [displayedInsights, setDisplayedInsights] = useState(insights.slice(0, maxInsights));

  useEffect(() => {
    setDisplayedInsights(insights.slice(0, maxInsights));
  }, [insights, maxInsights]);

  const getInsightIcon = (type: string) => {
    const insightType = type as InsightType;
    switch (insightType) {
      case 'learning_trend': return <TrendingUp className="h-4 w-4" />;
      case 'performance_prediction': return <Target className="h-4 w-4" />;
      case 'optimization_suggestion': return <Lightbulb className="h-4 w-4" />;
      case 'behavioral_pattern': return <Brain className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    const insightType = type as InsightType;
    switch (insightType) {
      case 'learning_trend': return 'text-blue-600 bg-blue-50';
      case 'performance_prediction': return 'text-green-600 bg-green-50';
      case 'optimization_suggestion': return 'text-purple-600 bg-purple-50';
      case 'behavioral_pattern': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    const impactLevel = impact as ImpactLevel;
    switch (impactLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleDismissInsight = (insightId: string) => {
    setDisplayedInsights(prev => prev.filter(insight => insight.id !== insightId));
  };

  const handleExecuteAction = (insight: any, actionIndex: number) => {
    const action = insight.suggestedActions?.[actionIndex];
    if (action) {
      console.log('Executing action:', action, 'for insight:', insight.id);
      // Here you would implement the actual action execution
    }
  };

  const handleViewAllActions = (insight: any) => {
    console.log('Viewing all actions for insight:', insight.id);
    // Here you would implement showing all actions in a modal or drawer
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Prediktivní pozorování
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Chyba při načítání AI pozorování: {error}
        </AlertDescription>
      </Alert>
    );
  }

  const isExpiring = (insight: any) => {
    if (!insight.expiresAt) return false;
    try {
      const expiryDate = new Date(insight.expiresAt);
      const now = new Date();
      const timeDiff = expiryDate.getTime() - now.getTime();
      return timeDiff < 24 * 60 * 60 * 1000; // Less than 24 hours
    } catch {
      return false;
    }
  };

  if (displayedInsights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Prediktivní pozorování
          </CardTitle>
          <CardDescription>
            AI analýza vašich dat pro lepší rozhodování
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Žádná pozorování nejsou k dispozici
          </p>
          <Button 
            onClick={generateInsights}
            disabled={isGeneratingInsights}
            className="flex items-center gap-2"
          >
            {isGeneratingInsights ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Generuji pozorování...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generovat pozorování
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Prediktivní pozorování
        </CardTitle>
        <CardDescription>
          AI analýza vašich dat pro lepší rozhodování
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedInsights.map((insight) => (
          <div key={insight.id} className="border rounded-lg p-4 relative">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded ${getInsightColor(insight.type || 'optimization_suggestion')}`}>
                  {getInsightIcon(insight.type || 'optimization_suggestion')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{insight.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{insight.description}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{insight.category}</span>
                    <span>•</span>
                    <span>{formatDate(insight.generatedAt || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getImpactColor(insight.impact || 'medium')}>
                  {insight.impact || 'medium'} dopad
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismissInsight(insight.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Confidence and Actions */}
            {insight.actionable && insight.suggestedActions && insight.suggestedActions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-medium mb-2">Doporučené akce:</div>
                <div className="space-y-1">
                  {insight.suggestedActions.slice(0, 2).map((action: string, index: number) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleExecuteAction(insight, index)}
                      className="text-xs h-6 mr-2"
                    >
                      {action}
                    </Button>
                  ))}
                  {insight.suggestedActions.length > 2 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewAllActions(insight)}
                      className="text-xs h-6"
                    >
                      +{insight.suggestedActions.length - 2} dalších
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Expiry Warning */}
            {isExpiring(insight) && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                <Clock className="h-3 w-3" />
                <span>Platné do: {formatDate(insight.expiresAt)}</span>
              </div>
            )}
          </div>
        ))}

        {insights.length > maxInsights && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm">
              Zobrazit více pozorování ({insights.length - maxInsights})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveInsightsPanel;
