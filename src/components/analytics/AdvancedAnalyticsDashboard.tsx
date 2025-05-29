
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye
} from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { LearningPattern, PredictiveInsight } from '@/services/AdvancedAnalyticsService';

interface AdvancedAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const {
    learningPattern,
    predictiveInsights,
    analyticsReport,
    isAnalyzing,
    isGeneratingReport,
    analyzeLearningPatterns,
    generatePredictiveInsights,
    generateAdvancedReport
  } = useAdvancedAnalytics();

  const [selectedInsightType, setSelectedInsightType] = useState<string>('all');

  const getInsightIcon = (type: PredictiveInsight['type']) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'difficulty': return <AlertTriangle className="h-4 w-4" />;
      case 'engagement': return <Activity className="h-4 w-4" />;
      case 'retention': return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: PredictiveInsight['type']) => {
    switch (type) {
      case 'performance': return 'text-green-600 bg-green-50';
      case 'difficulty': return 'text-orange-600 bg-orange-50';
      case 'engagement': return 'text-blue-600 bg-blue-50';
      case 'retention': return 'text-red-600 bg-red-50';
      default: return 'text-purple-600 bg-purple-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredInsights = selectedInsightType === 'all' 
    ? predictiveInsights 
    : predictiveInsights.filter(insight => insight.type === selectedInsightType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Pokročilá analytika AI
          </h2>
          <Button onClick={onClose} variant="outline" size="sm">
            Zavřít
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="patterns" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="patterns">Vzorce učení</TabsTrigger>
              <TabsTrigger value="insights">AI Predikce</TabsTrigger>
              <TabsTrigger value="reports">Reporty</TabsTrigger>
              <TabsTrigger value="recommendations">Doporučení</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Analýza vzorců učení</h3>
                <Button 
                  onClick={analyzeLearningPatterns}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {isAnalyzing ? 'Analyzuji...' : 'Aktualizovat analýzu'}
                </Button>
              </div>

              {learningPattern ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Learning Velocity */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Rychlost učení
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600 mb-2">
                        {learningPattern.learningVelocity.toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-600">lekcí za den</p>
                      <Progress 
                        value={Math.min(100, learningPattern.learningVelocity * 50)} 
                        className="mt-2" 
                      />
                    </CardContent>
                  </Card>

                  {/* Retention Rate */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-500" />
                        Míra udržení
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {Math.round(learningPattern.retentionRate * 100)}%
                      </div>
                      <p className="text-xs text-gray-600">konzistence učení</p>
                      <Progress 
                        value={learningPattern.retentionRate * 100} 
                        className="mt-2" 
                      />
                    </CardContent>
                  </Card>

                  {/* Optimal Session Length */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Optimální délka
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {learningPattern.optimalSessionLength} min
                      </div>
                      <p className="text-xs text-gray-600">ideální doba lekce</p>
                    </CardContent>
                  </Card>

                  {/* Preferred Times */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-sm">Preferované časy učení</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-2">
                        {learningPattern.preferredTimes.slice(0, 8).map((time) => (
                          <div key={time.hour} className="text-center p-2 bg-gray-50 rounded">
                            <div className="font-medium">{time.hour}:00</div>
                            <div className="text-xs text-gray-600">
                              {Math.round(time.engagement * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strong & Weak Areas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Silné a slabé stránky</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-xs text-green-600 font-medium mb-1">Silné oblasti</div>
                        <div className="flex flex-wrap gap-1">
                          {learningPattern.strongAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-red-600 font-medium mb-1">Slabé oblasti</div>
                        <div className="flex flex-wrap gap-1">
                          {learningPattern.weakAreas.map((area) => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {isAnalyzing ? 'Analyzuji vaše vzorce učení...' : 'Zatím nemáme dostatek dat pro analýzu'}
                    </p>
                    {!isAnalyzing && (
                      <Button onClick={analyzeLearningPatterns}>
                        Spustit analýzu
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">AI Prediktivní pozorování</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedInsightType}
                    onChange={(e) => setSelectedInsightType(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="all">Všechny typy</option>
                    <option value="performance">Výkon</option>
                    <option value="difficulty">Obtížnost</option>
                    <option value="engagement">Zapojení</option>
                    <option value="retention">Udržení</option>
                  </select>
                  <Button 
                    onClick={generatePredictiveInsights}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Aktualizovat
                  </Button>
                </div>
              </div>

              {filteredInsights.length > 0 ? (
                <div className="space-y-4">
                  {filteredInsights.map((insight, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded ${getInsightColor(insight.type)}`}>
                              {getInsightIcon(insight.type)}
                            </div>
                            <div>
                              <CardTitle className="text-sm capitalize">
                                {insight.type}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                Časový rámec: {insight.timeframe}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                              {Math.round(insight.confidence * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">spolehlivost</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{insight.prediction}</p>
                        
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-700">Doporučené akce:</div>
                          <ul className="text-xs space-y-1">
                            {insight.suggestedActions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-500">
                            Založeno na: {insight.basedOn.join(', ')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Žádná prediktivní pozorování k dispozici
                    </p>
                    <Button onClick={generatePredictiveInsights}>
                      Vygenerovat pozorování
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pokročilé reporty</h3>
                <Button 
                  onClick={() => generateAdvancedReport()}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  {isGeneratingReport ? 'Generuji...' : 'Vygenerovat report'}
                </Button>
              </div>

              {analyticsReport ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Souhrn reportu</CardTitle>
                      <CardDescription>
                        Vygenerováno: {analyticsReport.generatedAt.toLocaleString('cs-CZ')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {analyticsReport.data.totalSessions}
                          </div>
                          <div className="text-xs text-gray-600">Celkem sezení</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            {Math.round(analyticsReport.data.totalTimeSpent / 60000)} min
                          </div>
                          <div className="text-xs text-gray-600">Celkový čas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {analyticsReport.data.averageSessionLength} min
                          </div>
                          <div className="text-xs text-gray-600">Průměrná délka</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {analyticsReport.insights.length}
                          </div>
                          <div className="text-xs text-gray-600">AI pozorování</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Vizualizace</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600">
                        Dostupné grafy: {analyticsReport.visualizations.length}
                      </div>
                      <div className="mt-2 space-y-2">
                        {analyticsReport.visualizations.map((viz, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">{viz.config.title}</div>
                            <div className="text-xs text-gray-600">
                              Typ: {viz.type} | Data bodů: {viz.data.length}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {isGeneratingReport ? 'Generuji pokročilý report...' : 'Žádný report není k dispozici'}
                    </p>
                    {!isGeneratingReport && (
                      <Button onClick={() => generateAdvancedReport()}>
                        Vygenerovat první report
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <h3 className="text-lg font-medium">AI Doporučení</h3>
              
              {analyticsReport?.recommendations.length ? (
                <div className="space-y-3">
                  {analyticsReport.recommendations.map((recommendation, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Žádná doporučení nejsou k dispozici
                    </p>
                    <Button onClick={() => generateAdvancedReport()}>
                      Vygenerovat doporučení
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
