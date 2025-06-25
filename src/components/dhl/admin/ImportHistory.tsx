
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, FileText, Calendar, User } from 'lucide-react';
import { getImportHistory } from '@/services/dhl/dhlScheduleImporter';
import { toast } from 'sonner';

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
      <Card>
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Historie importů ({history.length})</h3>
        <Button onClick={loadHistory} variant="outline" size="sm">
          Obnovit
        </Button>
      </div>

      <div className="space-y-3">
        {history.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getStatusIcon(record.import_status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{record.file_name}</h4>
                      <Badge className={getStatusColor(record.import_status)}>
                        {record.import_status === 'success' ? 'Úspěch' : 
                         record.import_status === 'failed' ? 'Chyba' : record.import_status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.created_at).toLocaleString('cs-CZ')}
                        </span>
                        
                        {record.import_status === 'success' && (
                          <span>
                            Zpracováno: {record.records_processed} směn
                          </span>
                        )}
                      </div>
                      
                      {record.dhl_shift_schedules && (
                        <div>
                          Plán: {record.dhl_shift_schedules.schedule_name}
                        </div>
                      )}
                      
                      {record.error_message && (
                        <div className="text-red-600 dark:text-red-400">
                          Chyba: {record.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  {record.metadata?.validation_summary && (
                    <div className="space-y-1">
                      <div>Směny: {record.metadata.validation_summary.totalShifts}</div>
                      <div>Dny: {record.metadata.validation_summary.totalDays}</div>
                      
                      {record.metadata.validation_summary.detectedWoche && (
                        <div>Woche: {record.metadata.validation_summary.detectedWoche}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Warnings */}
              {record.metadata?.warnings && record.metadata.warnings.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Varování při importu:
                    </div>
                    <ul className="text-yellow-700 dark:text-yellow-300 space-y-0.5">
                      {record.metadata.warnings.slice(0, 3).map((warning: any, index: number) => (
                        <li key={index} className="text-xs">• {warning.message}</li>
                      ))}
                      {record.metadata.warnings.length > 3 && (
                        <li className="text-xs">... a {record.metadata.warnings.length - 3} dalších</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
