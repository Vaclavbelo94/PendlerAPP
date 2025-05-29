
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Brain, TrendingUp, Star, Download, Clock } from 'lucide-react';
import { SmartPackRecommendation } from '@/services/SmartLanguagePackService';

interface SmartPackRecommendationsProps {
  recommendations: SmartPackRecommendation[];
  isGenerating: boolean;
  onDownloadPack: (packId: string) => void;
  onGenerateRecommendations: () => void;
}

export const SmartPackRecommendations: React.FC<SmartPackRecommendationsProps> = ({
  recommendations,
  isGenerating,
  onDownloadPack,
  onGenerateRecommendations
}) => {
  const getPriorityColor = (priority: SmartPackRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSourceIcon = (basedOn: SmartPackRecommendation['basedOn']) => {
    switch (basedOn) {
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'usage': return <TrendingUp className="h-4 w-4" />;
      case 'progress': return <Star className="h-4 w-4" />;
      case 'preferences': return <Sparkles className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Doporučení balíčků
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Personalizovaná doporučení na základě vašeho pokroku a preferencí
          </p>
          <Button 
            onClick={onGenerateRecommendations}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generuji...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Aktualizovat
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {isGenerating 
                ? 'Generuji personalizovaná doporučení...' 
                : 'Žádná doporučení k dispozici. Klikněte na "Aktualizovat" pro nová doporučení.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation.packId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{recommendation.packId}</h3>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        {getSourceIcon(recommendation.basedOn)}
                        <span className="capitalize">{recommendation.basedOn}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {recommendation.reason}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Hodnota:</span>
                        <Progress 
                          value={recommendation.estimatedValue * 100} 
                          className="w-20 h-2"
                        />
                        <span className="text-xs text-gray-600">
                          {Math.round(recommendation.estimatedValue * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onDownloadPack(recommendation.packId)}
                    size="sm"
                    className="ml-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Stáhnout
                  </Button>
                </div>
                
                {index === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">Nejlepší doporučení</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
