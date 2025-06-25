
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface SchedulePreviewProps {
  scheduleData: any;
  validation?: any;
}

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({ 
  scheduleData, 
  validation 
}) => {
  if (!scheduleData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Žádná data k náhledu</p>
        </CardContent>
      </Card>
    );
  }

  // Extract shift entries (dates with time data)
  const shiftEntries = Object.entries(scheduleData)
    .filter(([key, value]) => 
      key.match(/^\d{4}-\d{2}-\d{2}$/) && 
      value && 
      typeof value === 'object' && 
      (value as any).start_time
    )
    .slice(0, 5); // Show first 5 entries

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Náhled plánu směn
          </CardTitle>
          <CardDescription>
            Preview importovaných dat před finálním uložením
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scheduleData.base_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Referenční datum</div>
                  <div className="text-muted-foreground">{scheduleData.base_date}</div>
                </div>
              </div>
            )}
            
            {scheduleData.woche && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Woche {scheduleData.woche}</Badge>
              </div>
            )}
            
            {validation?.summary && (
              <>
                <div className="text-sm">
                  <div className="font-medium">Celkem směn</div>
                  <div className="text-muted-foreground">{validation.summary.totalShifts}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Celkem dní</div>
                  <div className="text-muted-foreground">{validation.summary.totalDays}</div>
                </div>
              </>
            )}
          </div>

          {/* Sample shifts */}
          {shiftEntries.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Ukázka směn:</h4>
              <div className="space-y-2">
                {shiftEntries.map(([date, shift]) => {
                  const shiftData = shift as any;
                  return (
                    <div key={date} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{date}</div>
                          {shiftData.day && (
                            <div className="text-sm text-muted-foreground">{shiftData.day}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {shiftData.start_time} - {shiftData.end_time}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(scheduleData).filter(key => 
                  key.match(/^\d{4}-\d{2}-\d{2}$/) && scheduleData[key]?.start_time
                ).length > 5 && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    ... a {Object.keys(scheduleData).filter(key => 
                      key.match(/^\d{4}-\d{2}-\d{2}$/) && scheduleData[key]?.start_time
                    ).length - 5} dalších směn
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation warnings */}
          {validation?.warnings && validation.warnings.length > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                  Varování
                </span>
              </div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {validation.warnings.slice(0, 3).map((warning: any, index: number) => (
                  <li key={index}>• {warning.message}</li>
                ))}
                {validation.warnings.length > 3 && (
                  <li>... a {validation.warnings.length - 3} dalších varování</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
