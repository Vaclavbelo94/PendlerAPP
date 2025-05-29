
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAdvancedErrorHandling } from '@/hooks/useAdvancedErrorHandling';

const ErrorStatsWidget: React.FC = () => {
  const { errorStats, clearOldErrors, processRetryQueue } = useAdvancedErrorHandling();

  if (!errorStats || errorStats.total === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Stav chyb
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600">Žádné chyby za posledních 24 hodin</p>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'network': return <Activity className="h-3 w-3" />;
      case 'timeout': return <Clock className="h-3 w-3" />;
      case 'server': return <XCircle className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Statistiky chyb
        </CardTitle>
        <CardDescription>
          {errorStats.total} chyb celkem, {errorStats.recent} za poslední hodinu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error types */}
        <div>
          <h4 className="text-xs font-medium mb-2">Podle typu:</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(errorStats.byType).map(([type, count]) => (
              <Badge 
                key={type} 
                variant="outline" 
                className="text-xs flex items-center gap-1"
              >
                {getTypeIcon(type)}
                {type}: {count as number}
              </Badge>
            ))}
          </div>
        </div>

        {/* Error severity */}
        <div>
          <h4 className="text-xs font-medium mb-2">Podle závažnosti:</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(errorStats.bySeverity).map(([severity, count]) => (
              <Badge 
                key={severity} 
                className={`text-xs ${getSeverityColor(severity)}`}
              >
                {severity}: {count as number}
              </Badge>
            ))}
          </div>
        </div>

        {/* Retryable stats */}
        <div className="flex items-center justify-between text-xs">
          <span>Automaticky opakovatelné:</span>
          <Badge variant="secondary">
            {errorStats.retryable}/{errorStats.total}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => processRetryQueue('all')}
            className="flex-1 text-xs"
          >
            Zpracovat frontu
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => clearOldErrors(24)}
            className="flex-1 text-xs"
          >
            Vyčistit staré
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorStatsWidget;
