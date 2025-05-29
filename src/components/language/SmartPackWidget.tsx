
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Package, 
  TrendingUp, 
  Zap,
  Settings,
  BarChart3
} from 'lucide-react';
import { useSmartLanguagePacks } from '@/hooks/useSmartLanguagePacks';
import { SmartLanguagePackDashboard } from './SmartLanguagePackDashboard';

const SmartPackWidget: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const {
    recommendations,
    usageReport,
    isGeneratingRecommendations,
    generateRecommendations
  } = useSmartLanguagePacks();

  const mockProgress = [
    { id: '1', itemId: 'vocab_1', masteryLevel: 0.8, category: 'work' },
    { id: '2', itemId: 'vocab_2', masteryLevel: 0.6, category: 'daily' }
  ];

  const mockPreferences = {
    workFocused: true,
    targetDifficulty: 'intermediate' as const,
    categories: ['work', 'daily'],
    packSize: 50
  };

  const handleQuickRecommendation = () => {
    generateRecommendations(mockProgress, mockPreferences);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            Smart Language Packs
          </CardTitle>
          <CardDescription>
            AI-powered personalized learning packs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {recommendations.length}
              </div>
              <div className="text-xs text-gray-600">Doporučení</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {usageReport ? usageReport.totalPacks : 0}
              </div>
              <div className="text-xs text-gray-600">Balíčků</div>
            </div>
          </div>

          {/* Top Recommendation */}
          {recommendations.length > 0 && (
            <div className="border rounded-lg p-3 bg-purple-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">{recommendations[0].packId}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {recommendations[0].reason.slice(0, 60)}...
                  </div>
                </div>
                <Badge className="ml-2" variant={
                  recommendations[0].priority === 'high' ? 'default' : 'secondary'
                }>
                  {Math.round(recommendations[0].estimatedValue * 100)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">
                  Založeno na: {recommendations[0].basedOn}
                </span>
                <Button size="sm" variant="outline" className="h-6 text-xs">
                  Zobrazit
                </Button>
              </div>
            </div>
          )}

          {/* Usage Stats */}
          {usageReport && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Průměrná dokončenost</span>
                <span className="font-medium">
                  {Math.round(usageReport.avgCompletionRate * 100)}%
                </span>
              </div>
              <Progress value={usageReport.avgCompletionRate * 100} className="h-2" />
              
              {usageReport.mostUsedPack !== 'none' && (
                <div className="flex items-center justify-between text-xs">
                  <span>Nejpoužívanější</span>
                  <span className="font-medium">{usageReport.mostUsedPack}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleQuickRecommendation}
              disabled={isGeneratingRecommendations}
              className="flex-1 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              {isGeneratingRecommendations ? 'AI pracuje...' : 'AI doporučení'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowDashboard(true)}
              className="flex-1 text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Dashboard
            </Button>
          </div>

          {/* Features List */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3" />
              <span>Personalizované balíčky</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>Delta aktualizace</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3" />
              <span>Pokročilá analytika</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <SmartLanguagePackDashboard 
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </>
  );
};

export default SmartPackWidget;
