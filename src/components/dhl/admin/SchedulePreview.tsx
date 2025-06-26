import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Clock, AlertTriangle, Upload, ArrowLeft } from 'lucide-react';
import './MobileDHLStyles.css';

interface SchedulePreviewProps {
  jsonData: any;
  validation?: any;
  formData?: {
    positionId: string;
    workGroupId: string;
    scheduleName: string;
  };
  handleImport?: () => Promise<void>;
  resetUpload?: () => void;
}

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({ 
  jsonData, 
  validation,
  formData,
  handleImport,
  resetUpload
}) => {
  if (!jsonData) {
    return (
      <Card className="dhl-mobile-card">
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

  const shiftEntries = getShiftEntries(jsonData);

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

  const metadata = getMetadata(jsonData);

  return (
    <div className="space-y-4">
      <Card className="dhl-mobile-card">
        <CardHeader className="dhl-mobile-card-header">
          <CardTitle className="dhl-mobile-card-title flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span>Náhled plánu směn</span>
          </CardTitle>
          <CardDescription className="dhl-mobile-card-description">
            Preview importovaných dat před finálním uložením
          </CardDescription>
        </CardHeader>
        <CardContent className="dhl-mobile-card-content space-y-4">
          {/* Metadata - Mobile Layout */}
          <div className="dhl-mobile-summary">
            <div className="space-y-3">
              {metadata.base_date && (
                <div className="dhl-mobile-schedule-item">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="dhl-mobile-schedule-label">Referenční datum</div>
                      <div className="dhl-mobile-schedule-value">{metadata.base_date}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {metadata.woche && (
                  <Badge variant="secondary" className="text-xs">
                    Woche {metadata.woche}
                  </Badge>
                )}
                {metadata.position && (
                  <Badge variant="outline" className="text-xs">
                    {metadata.position}
                  </Badge>
                )}
              </div>

              {validation?.summary && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="dhl-mobile-summary-item">
                    <span className="dhl-mobile-summary-label">Celkem směn:</span>
                    <span className="dhl-mobile-summary-value">{validation.summary.totalShifts}</span>
                  </div>
                  <div className="dhl-mobile-summary-item">
                    <span className="dhl-mobile-summary-label">Celkem dní:</span>
                    <span className="dhl-mobile-summary-value">{validation.summary.totalDays}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sample shifts - Mobile Layout */}
          {shiftEntries.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 text-sm sm:text-base">Ukázka směn:</h4>
              <div className="space-y-2">
                {shiftEntries.map(([date, shift]) => {
                  const shiftData = shift as any;
                  return (
                    <div key={date} className="dhl-mobile-shift-preview">
                      <div className="dhl-mobile-shift-header">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="dhl-mobile-shift-date dhl-text-truncate">{date}</div>
                              {shiftData.day && (
                                <div className="dhl-mobile-shift-day">{shiftData.day}</div>
                              )}
                            </div>
                          </div>
                          {shiftData.woche && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              W{shiftData.woche}
                            </Badge>
                          )}
                        </div>
                        <div className="dhl-mobile-shift-time">
                          <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span>
                            {shiftData.start_time} - {shiftData.end_time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Count total shifts for display */}
                {(() => {
                  let totalShifts = 0;
                  
                  if (jsonData.shifts) {
                    totalShifts = jsonData.shifts.filter((shift: any) => 
                      shift.date && (shift.start || shift.start_time)
                    ).length;
                  } else if (jsonData.entries) {
                    totalShifts = jsonData.entries.filter((entry: any) => 
                      entry.date && (entry.start || entry.start_time)
                    ).length;
                  } else {
                    totalShifts = Object.keys(jsonData).filter(key => 
                      key.match(/^\d{4}-\d{2}-\d{2}$/) && jsonData[key]?.start_time
                    ).length;
                  }
                  
                  return totalShifts > 5 && (
                    <div className="text-xs sm:text-sm text-muted-foreground text-center py-2 bg-muted/30 rounded">
                      ... a {totalShifts - 5} dalších směn
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Validation warnings - Mobile Layout */}
          {validation?.warnings && validation.warnings.length > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                  Varování
                </span>
              </div>
              <ul className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {validation.warnings.slice(0, 3).map((warning: any, index: number) => (
                  <li key={index} className="dhl-text-wrap">• {warning.message}</li>
                ))}
                {validation.warnings.length > 3 && (
                  <li>... a {validation.warnings.length - 3} dalších varování</li>
                )}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          {handleImport && resetUpload && (
            <div className="dhl-mobile-actions">
              <div className="dhl-mobile-button-group">
                <Button variant="outline" onClick={resetUpload} className="dhl-mobile-button-secondary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zpět
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={!validation?.isValid}
                  className="dhl-mobile-button-secondary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importovat
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
