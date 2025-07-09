import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Calendar,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { JsonFormatAnalysis } from '@/services/dhl/jsonFormatDetector';

interface JsonFormatDetectorProps {
  analysis: JsonFormatAnalysis;
  fileName: string;
}

export const JsonFormatDetector: React.FC<JsonFormatDetectorProps> = ({ 
  analysis, 
  fileName 
}) => {
  const getFormatIcon = (formatType: string) => {
    switch (formatType) {
      case 'wechselschicht_yearly':
        return <Calendar className="h-4 w-4" />;
      case 'wechselschicht_weekly':
        return <Clock className="h-4 w-4" />;
      case 'standard':
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getFormatLabel = (formatType: string) => {
    switch (formatType) {
      case 'wechselschicht_yearly':
        return 'Wechselschicht 30h - Roční plán';
      case 'wechselschicht_weekly':
        return 'Wechselschicht 30h - Týdenní plán';
      case 'standard':
        return 'Standardní formát';
      default:
        return 'Nerozpoznaný formát';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (confidence >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          {getFormatIcon(analysis.formatType)}
          <span>🔍 Analýza JSON formátu</span>
        </CardTitle>
        <CardDescription className="text-blue-600 dark:text-blue-400">
          Automatická detekce a návrh konfigurace pro: <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">{fileName}</code>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Format Detection */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            {getFormatIcon(analysis.formatType)}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {getFormatLabel(analysis.formatType)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {analysis.totalRecords} záznamů • {analysis.workingDays} pracovních směn
              </p>
            </div>
          </div>
          
          <Badge className={`${getConfidenceColor(analysis.confidence)} border`}>
            {analysis.confidence}% jistota
          </Badge>
        </div>

        {/* Detected Groups */}
        {analysis.detectedGroups.length > 0 && (
          <div className="p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Detekované pracovní skupiny
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.detectedGroups.map((group) => (
                <Badge 
                  key={group} 
                  variant={group === analysis.suggestedGroup ? "default" : "secondary"}
                  className={group === analysis.suggestedGroup ? "bg-blue-600 text-white" : ""}
                >
                  Skupina {group}
                  {group === analysis.suggestedGroup && <Target className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
            
            {analysis.suggestedGroup && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                💡 Doporučeno: Skupina {analysis.suggestedGroup}
              </p>
            )}
          </div>
        )}

        {/* Calendar Weeks Info */}
        {analysis.calendarWeeks && analysis.calendarWeeks.length > 0 && (
          <div className="p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Kalendářní týdny
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.calendarWeeks[0]} → {analysis.calendarWeeks[analysis.calendarWeeks.length - 1]}
              <span className="ml-2 text-blue-600">({analysis.calendarWeeks.length} týdnů)</span>
            </p>
            
            {analysis.yearlyData && (
              <Badge variant="secondary" className="mt-2">
                📅 Roční data
              </Badge>
            )}
          </div>
        )}

        {/* Suggested Name */}
        {analysis.suggestedName && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                Navrhovaný název
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 font-mono bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
              {analysis.suggestedName}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  📋 Analýza a doporučení:
                </p>
                {analysis.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-blue-700 dark:text-blue-300">
                    {rec}
                  </p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Warning for unknown format */}
        {analysis.formatType === 'unknown' && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                ⚠️ Nerozpoznaný formát
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Soubor neodpovídá žádnému známému formátu. Zkontrolujte strukturu dat a zkuste znovu.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};