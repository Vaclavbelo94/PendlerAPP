
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Package, 
  TrendingUp, 
  Download, 
  Star,
  Clock,
  Users,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';
import { useSmartLanguagePacks } from '@/hooks/useSmartLanguagePacks';

interface SmartLanguagePackDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartLanguagePackDashboard: React.FC<SmartLanguagePackDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const {
    recommendations,
    analytics,
    usageReport,
    isGeneratingRecommendations,
    isCreatingPersonalizedPack,
    generateRecommendations,
    createPersonalizedPack,
    generateUsageReport
  } = useSmartLanguagePacks();

  const [userPreferences, setUserPreferences] = useState({
    workFocused: true,
    targetDifficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    categories: ['work', 'daily'],
    packSize: 50
  });

  const [mockProgress] = useState([
    { id: '1', itemId: 'vocab_1', masteryLevel: 0.8, category: 'work' },
    { id: '2', itemId: 'vocab_2', masteryLevel: 0.6, category: 'daily' },
    { id: '3', itemId: 'vocab_3', masteryLevel: 0.9, category: 'transport' }
  ]);

  useEffect(() => {
    if (isOpen) {
      generateUsageReport();
    }
  }, [isOpen, generateUsageReport]);

  const handleGenerateRecommendations = async () => {
    await generateRecommendations(mockProgress, userPreferences);
  };

  const handleCreatePersonalizedPack = async () => {
    await createPersonalizedPack(userPreferences);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Smart Language Packs
          </h2>
          <Button onClick={onClose} variant="outline" size="sm">
            Zavřít
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">Doporučení</TabsTrigger>
              <TabsTrigger value="analytics">Analytika</TabsTrigger>
              <TabsTrigger value="personalized">Personalizace</TabsTrigger>
              <TabsTrigger value="performance">Výkon</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">AI Doporučení balíčků</h3>
                <Button 
                  onClick={handleGenerateRecommendations}
                  disabled={isGeneratingRecommendations}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {isGeneratingRecommendations ? 'Generuji...' : 'Vygenerovat doporučení'}
                </Button>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid gap-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.packId}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">{rec.packId}</CardTitle>
                            <CardDescription className="mt-1">
                              {rec.reason}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">
                                {Math.round(rec.estimatedValue * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-600">
                                Založeno na: {rec.basedOn}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Stáhnout
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Zatím nemáme žádná doporučení
                    </p>
                    <Button onClick={handleGenerateRecommendations}>
                      Vygenerovat první doporučení
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {usageReport ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Celkem balíčků
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{usageReport.totalPacks}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Nejpoužívanější
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium">{usageReport.mostUsedPack}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Průměrná dokončenost
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.round(usageReport.avgCompletionRate * 100)}%
                      </div>
                      <Progress value={usageReport.avgCompletionRate * 100} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Načítám analytiku...</p>
                  </CardContent>
                </Card>
              )}

              {usageReport?.trends && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Trendy využití</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {usageReport.trends.map((trend: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{trend.packId}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={trend.trend === 'increasing' ? 'default' : 'secondary'}>
                              {trend.trend}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(trend.momentum)}min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="personalized" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Personalizované balíčky</h3>
                <Button 
                  onClick={handleCreatePersonalizedPack}
                  disabled={isCreatingPersonalizedPack}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {isCreatingPersonalizedPack ? 'Vytvářím...' : 'Vytvořit balíček'}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preference</CardTitle>
                  <CardDescription>
                    Upravte své preference pro personalizované balíčky
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Zaměření na práci</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          checked={userPreferences.workFocused}
                          onChange={(e) => setUserPreferences(prev => ({
                            ...prev,
                            workFocused: e.target.checked
                          }))}
                        />
                        <span className="text-sm">Zahrnout pracovní slovník</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Cílová obtížnost</label>
                      <select
                        value={userPreferences.targetDifficulty}
                        onChange={(e) => setUserPreferences(prev => ({
                          ...prev,
                          targetDifficulty: e.target.value as any
                        }))}
                        className="w-full mt-1 p-2 border rounded"
                      >
                        <option value="beginner">Začátečník</option>
                        <option value="intermediate">Pokročilý</option>
                        <option value="advanced">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Velikost balíčku</label>
                      <input
                        type="number"
                        value={userPreferences.packSize}
                        onChange={(e) => setUserPreferences(prev => ({
                          ...prev,
                          packSize: parseInt(e.target.value)
                        }))}
                        className="w-full mt-1 p-2 border rounded"
                        min="10"
                        max="200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Rychlost načítání
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Komprese dat</span>
                        <span className="text-sm font-medium">Aktivní</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Delta aktualizace</span>
                        <span className="text-sm font-medium">Povoleno</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cache hit rate</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Synchronizace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Aktivní zařízení</span>
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Poslední sync</span>
                        <span className="text-sm font-medium">před 5 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Konflikty</span>
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
