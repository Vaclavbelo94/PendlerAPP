
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, FileText, Calendar, User } from 'lucide-react';
import { getImportHistory } from '@/services/dhl/dhlScheduleImporter';
import { toast } from 'sonner';
import './MobileDHLStyles.css';

export const ImportHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getImportHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading import history:', error);
      toast.error('Chyba při načítání historie importů');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Načítám historii...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="dhl-mobile-card">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Žádná historie</h3>
          <p className="text-muted-foreground">
            Zatím neproběhly žádné importy plánů směn.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-medium">Historie importů ({history.length})</h3>
        <Button onClick={loadHistory} variant="outline" size="sm" className="w-full sm:w-auto">
          Obnovit
        </Button>
      </div>

      <div className="space-y-3">
        {history.map((record) => (
          <Card key={record.id} className="dhl-mobile-card">
            <CardContent className="dhl-mobile-card-content">
              <div className="space-y-3">
                {/* Header with status */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {getStatusIcon(record.import_status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm sm:text-base dhl-text-truncate flex-1">
                        {record.file_name}
                      </h4>
                      <Badge className={`${getStatusColor(record.import_status)} text-xs flex-shrink-0`}>
                        {record.import_status === 'success' ? 'Úspěch' : 
                         record.import_status === 'failed' ? 'Chyba' : record.import_status}
                      </Badge>
                    </div>
                    
                    {/* Date and basic info */}
                    <div className="dhl-mobile-schedule-item">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                      
                      {record.import_status === 'success' && (
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Zpracováno: {record.records_processed} směn
                        </div>
                      )}
                      
                      {record.dhl_shift_schedules && (
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Plán: {record.dhl_shift_schedules.schedule_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Grid - Mobile Optimized */}
                {record.metadata?.validation_summary && (
                  <div className="dhl-mobile-summary">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="dhl-mobile-summary-item">
                        <span className="dhl-mobile-summary-label">Směny:</span>
                        <span className="dhl-mobile-summary-value">
                          {record.metadata.validation_summary.totalShifts}
                        </span>
                      </div>
                      <div className="dhl-mobile-summary-item">
                        <span className="dhl-mobile-summary-label">Dny:</span>
                        <span className="dhl-mobile-summary-value">
                          {record.metadata.validation_summary.totalDays}
                        </span>
                      </div>
                      {record.metadata.validation_summary.detectedWoche && (
                        <div className="dhl-mobile-summary-item col-span-2 sm:col-span-1">
                          <span className="dhl-mobile-summary-label">Woche:</span>
                          <span className="dhl-mobile-summary-value">
                            {record.metadata.validation_summary.detectedWoche}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {record.error_message && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200">
                    <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 dhl-text-wrap">
                      <span className="font-medium">Chyba:</span> {record.error_message}
                    </div>
                  </div>
                )}

                {/* Warnings - Mobile Optimized */}
                {record.metadata?.warnings && record.metadata.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">
                        Varování při importu
                      </span>
                    </div>
                    <div className="space-y-1">
                      {record.metadata.warnings.slice(0, 3).map((warning: any, index: number) => (
                        <div key={index} className="text-xs text-yellow-700 dark:text-yellow-300 dhl-text-wrap">
                          • {warning.message}
                        </div>
                      ))}
                      {record.metadata.warnings.length > 3 && (
                        <div className="text-xs text-yellow-700 dark:text-yellow-300">
                          ... a {record.metadata.warnings.length - 3} dalších varování
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
