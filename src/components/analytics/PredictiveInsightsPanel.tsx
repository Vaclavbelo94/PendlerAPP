
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Activity,
  Eye,
  Zap,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAIInsights } from '@/hooks/useAIInsights';
import { AIInsight } from '@/services/AIInsightsService';

const PredictiveInsightsPanel: React.FC = () => {
  const {
    insights,
    models,
    isGeneratingInsights,
    generateInsights,
    getInsightsByType,
    getHighImpactInsights,
    getActionableInsights
  } = useAIInsights();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'learning_trend': return <TrendingUp className="h-4 w-4" />;
      case 'performance_prediction': return <Target className="h-4 w-4" />;
      case 'optimization_suggestion': return <Zap className="h-4 w-4" />;
      case 'behavioral_pattern': return <Activity className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'learning_trend': return 'text-green-600 bg-green-50';
      case 'performance_prediction': return 'text-blue-600 bg-blue-50';
      case 'optimization_suggestion': return 'text-purple-600 bg-purple-50';
      case 'behavioral_pattern': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : selectedCategory === 'high-impact'
    ? getHighImpactInsights()
    : selectedCategory === 'actionable'
    ? getActionableInsights()
    : getInsightsByType(selectedCategory as AIInsight['type']);

  const topModels = models.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Prediktivní pozorování
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Pokročilé AI analýzy a predikce na základě vašich dat
          </p>
        </div>
        <Button 
          onClick={() => generateInsights()}
          disabled={isGeneratingInsights}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {isGeneratingInsights ? 'Generuji...' : 'Aktualizovat pozorování'}
        </Button>
      </div>

      {/* AI Models Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stav AI modelů
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topModels.map((model) => (
              <div key={model.name} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{model.name}</div>
                  <Badge variant="secondary" className="text-xs">
                    v{model.version}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Přesnost:</span>
                    <span className={getConfidenceColor(model.accuracy)}>
                      {Math.round(model.accuracy * 100)}%
                    </span>
                  </div>
                  <Progress value={model.accuracy * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {model.dataPoints.toLocaleString()} datových bodů
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              Všechny ({insights.length})
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'high-impact' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('high-impact')}
            >
              Vysoký dopad ({getHighImpactInsights().length})
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'actionable' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('actionable')}
            >
              Akční ({getActionableInsights().length})
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'learning_trend' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('learning_trend')}
            >
              Trendy ({getInsightsByType('learning_trend').length})
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'performance_prediction' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('performance_prediction')}
            >
              Predikce ({getInsightsByType('performance_prediction').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      {filteredInsights.length > 0 ? (
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{insight.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {insight.category} • {insight.generatedAt.toLocaleDateString('cs-CZ')}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {Math.round(insight.confidence * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">spolehlivost</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                
                {insight.actionable && insight.suggestedActions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700">
                      Doporučené akce:
                    </div>
                    <div className="space-y-1">
                      {insight.suggestedActions.slice(0, showDetails === insight.id ? undefined : 2).map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{action}</span>
                        </div>
                      ))}
                      {insight.suggestedActions.length > 2 && showDetails !== insight.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowDetails(insight.id)}
                          className="text-xs h-6 px-2"
                        >
                          Zobrazit více ({insight.suggestedActions.length - 2})
                        </Button>
                      )}
                      {showDetails === insight.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowDetails(null)}
                          className="text-xs h-6 px-2"
                        >
                          Zobrazit méně
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {insight.expiresAt && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        Platné do: {insight.expiresAt.toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {isGeneratingInsights ? 'Generuji AI pozorování...' : 'Žádná pozorování k dispozici'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isGeneratingInsights 
                ? 'AI modely analyzují vaše data a připravují personalizovaná pozorování'
                : selectedCategory === 'all'
                ? 'Zatím nemáme žádná AI pozorování. Zkuste vygenerovat nová pozorování.'
                : `Žádná pozorování v kategorii "${selectedCategory}".`
              }
            </p>
            {!isGeneratingInsights && (
              <Button onClick={() => generateInsights()}>
                <Eye className="h-4 w-4 mr-2" />
                Vygenerovat první pozorování
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Shrnutí pozorování</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {insights.length}
                </div>
                <div className="text-xs text-gray-600">Celkem</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {getHighImpactInsights().length}
                </div>
                <div className="text-xs text-gray-600">Vysoký dopad</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {getActionableInsights().length}
                </div>
                <div className="text-xs text-gray-600">Akční</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length * 100)}%
                </div>
                <div className="text-xs text-gray-600">Průměrná spolehlivost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictiveInsightsPanel;
