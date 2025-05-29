
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Eye, 
  Zap,
  AlertTriangle,
  Target,
  BarChart3
} from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { AdvancedAnalyticsDashboard } from './AdvancedAnalyticsDashboard';

const AdvancedAnalyticsWidget: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    learningPattern,
    predictiveInsights,
    isAnalyzing,
    analyzeLearningPatterns,
    generatePredictiveInsights
  } = useAdvancedAnalytics();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-3 w-3" />;
      case 'difficulty': return <AlertTriangle className="h-3 w-3" />;
      case 'engagement': return <Zap className="h-3 w-3" />;
      case 'retention': return <Target className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-green-600';
      case 'difficulty': return 'text-orange-600';
      case 'engagement': return 'text-blue-600';
      case 'retention': return 'text-red-600';
      default: return 'text-purple-600';
    }
  };

  const topInsight = predictiveInsights
    .sort((a, b) => b.confidence - a.confidence)[0];

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Analytics
          </CardTitle>
          <CardDescription>
            Pokročilá analytika a prediktivní pozorování
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {predictiveInsights.length}
              </div>
              <div className="text-xs text-gray-600">AI pozorování</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {learningPattern ? Math.round(learningPattern.retentionRate * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600">Udržení</div>
            </div>
          </div>

          {/* Learning Pattern Summary */}
          {learningPattern && (
            <div className="border rounded-lg p-3 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">Vzorec učení</div>
                <Badge variant="secondary" className="text-xs">
                  Aktualizováno
                </Badge>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Rychlost učení:</span>
                  <span className="font-medium">
                    {learningPattern.learningVelocity.toFixed(1)}/den
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Optimální délka:</span>
                  <span className="font-medium">
                    {learningPattern.optimalSessionLength} min
                  </span>
                </div>
                <Progress 
                  value={learningPattern.retentionRate * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          )}

          {/* Top AI Insight */}
          {topInsight && (
            <div className="border rounded-lg p-3 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={getInsightColor(topInsight.type)}>
                    {getInsightIcon(topInsight.type)}
                  </div>
                  <div className="font-medium text-sm">Top AI pozorování</div>
                </div>
                <Badge className="text-xs">
                  {Math.round(topInsight.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {topInsight.prediction.slice(0, 80)}...
              </p>
              <div className="text-xs text-purple-600">
                Časový rámec: {topInsight.timeframe}
              </div>
            </div>
          )}

          {/* Learning Metrics */}
          {learningPattern && (
            <div className="space-y-2">
              <div className="text-xs font-medium">Silné oblasti</div>
              <div className="flex flex-wrap gap-1">
                {learningPattern.strongAreas.slice(0, 3).map((area) => (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
                {learningPattern.strongAreas.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{learningPattern.strongAreas.length - 3}
                  </Badge>
                )}
              </div>
              
              {learningPattern.weakAreas.length > 0 && (
                <>
                  <div className="text-xs font-medium text-orange-600">Oblasti ke zlepšení</div>
                  <div className="flex flex-wrap gap-1">
                    {learningPattern.weakAreas.slice(0, 2).map((area) => (
                      <Badge key={area} variant="outline" className="text-xs text-orange-600">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={analyzeLearningPatterns}
              disabled={isAnalyzing}
              className="flex-1 text-xs"
            >
              <Brain className="h-3 w-3 mr-1" />
              {isAnalyzing ? 'Analyzuji...' : 'Analýza'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={generatePredictiveInsights}
              className="flex-1 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Predikce
            </Button>
          </div>

          <Button 
            size="sm" 
            onClick={() => setShowDashboard(true)}
            className="w-full text-xs"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Otevřít pokročilou analytiku
          </Button>

          {/* Features List */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="h-3 w-3" />
              <span>AI prediktivní modely</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>Analýza vzorců učení</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3" />
              <span>Personalizovaná doporučení</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdvancedAnalyticsDashboard 
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </>
  );
};

export default AdvancedAnalyticsWidget;
