
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

  // Handle all formats - shifts array, entries array and direct date keys
  const getShiftEntries = (data: any) => {
    // Handle new shifts format
    if (data.shifts && Array.isArray(data.shifts)) {
      return data.shifts
        .filter((shift: any) => shift.date && (shift.start || shift.start_time))
        .slice(0, 5)
        .map((shift: any) => [
          shift.date,
          {
            start_time: shift.start || shift.start_time,
            end_time: shift.end || shift.end_time,
            day: shift.day,
            woche: data.woche // Use woche from root level
          }
        ]);
    }
    
    // If data has entries array, use it
    if (data.entries && Array.isArray(data.entries)) {
      return data.entries
        .filter((entry: any) => entry.date && (entry.start || entry.start_time))
        .slice(0, 5)
        .map((entry: any) => [
          entry.date,
          {
            start_time: entry.start || entry.start_time,
            end_time: entry.end || entry.end_time,
            day: entry.day,
            woche: entry.woche
          }
        ]);
    }

    // Otherwise extract from date keys
    return Object.entries(data)
      .filter(([key, value]) => 
        key.match(/^\d{4}-\d{2}-\d{2}$/) && 
        value && 
        typeof value === 'object' && 
        (value as any).start_time
      )
      .slice(0, 5);
  };

  const shiftEntries = getShiftEntries(scheduleData);

  // Extract metadata based on format
  const getMetadata = (data: any) => {
    // Handle new shifts format
    if (data.shifts && Array.isArray(data.shifts)) {
      return {
        base_date: data.valid_from || data.base_date,
        woche: data.woche,
        position: data.position || 'Sortierer',
        description: data.description
      };
    }
    
    // Handle entries format
    if (data.entries && Array.isArray(data.entries)) {
      return {
        base_date: data.base_date,
        woche: data.entries.length > 0 ? data.entries[0].woche : null,
        position: data.position,
        description: data.description
      };
    }
    
    // Direct format
    return {
      base_date: data.base_date,
      woche: data.woche,
      position: data.position,
      description: data.description
    };
  };

  const metadata = getMetadata(scheduleData);

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
            {metadata.base_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">Referenční datum</div>
                  <div className="text-muted-foreground">{metadata.base_date}</div>
                </div>
              </div>
            )}
            
            {metadata.woche && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Woche {metadata.woche}</Badge>
              </div>
            )}

            {metadata.position && (
              <div className="text-sm">
                <div className="font-medium">Pozice</div>
                <div className="text-muted-foreground">{metadata.position}</div>
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
                          {shiftData.woche && (
                            <div className="text-xs text-muted-foreground">Woche {shiftData.woche}</div>
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
                
                {/* Count total shifts for display */}
                {(() => {
                  let totalShifts = 0;
                  
                  if (scheduleData.shifts) {
                    totalShifts = scheduleData.shifts.filter((shift: any) => 
                      shift.date && (shift.start || shift.start_time)
                    ).length;
                  } else if (scheduleData.entries) {
                    totalShifts = scheduleData.entries.filter((entry: any) => 
                      entry.date && (entry.start || entry.start_time)
                    ).length;
                  } else {
                    totalShifts = Object.keys(scheduleData).filter(key => 
                      key.match(/^\d{4}-\d{2}-\d{2}$/) && scheduleData[key]?.start_time
                    ).length;
                  }
                  
                  return totalShifts > 5 && (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      ... a {totalShifts - 5} dalších směn
                    </div>
                  );
                })()}
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
