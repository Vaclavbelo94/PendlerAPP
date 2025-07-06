
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Calendar, Users, Settings, Trash2, Play, ChevronDown, Folder } from 'lucide-react';
import { getDHLSchedules, deleteSchedule } from '@/services/dhl/dhlScheduleImporter';
import { generateShiftsFromSchedule } from '@/services/dhl/shiftGenerator';
import { toast } from 'sonner';
import './MobileDHLStyles.css';

interface SchedulesByPosition {
  [positionName: string]: any[];
}

export const SchedulesList: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingSchedule, setGeneratingSchedule] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await getDHLSchedules();
      setSchedules(data);
      
      // Auto-open categories that have schedules
      const categoriesWithSchedules = [...new Set(data.map(schedule => schedule.dhl_positions?.name || 'Ostatní'))];
      setOpenCategories(categoriesWithSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Chyba při načítání plánů směn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
    
    // Listen for custom event to switch to upload tab
    const handleSwitchToUpload = () => {
      // This will be handled by parent component
      window.parent?.postMessage({ action: 'switchToUploadTab' }, '*');
    };
    
    window.addEventListener('switchToUploadTab', handleSwitchToUpload);
    
    return () => {
      window.removeEventListener('switchToUploadTab', handleSwitchToUpload);
    };
  }, []);

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Opravdu chcete smazat tento plán směn?')) {
      return;
    }

    try {
      await deleteSchedule(scheduleId);
      loadSchedules(); // Reload list
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Chyba při smazání plánu');
    }
  };

  const handleGenerateShifts = async (scheduleId: string) => {
    try {
      setGeneratingSchedule(scheduleId);
      const result = await generateShiftsFromSchedule({ scheduleId });
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Chyba při generování směn');
      }
    } catch (error) {
      console.error('Error generating shifts:', error);
      toast.error('Chyba při generování směn');
    } finally {
      setGeneratingSchedule(null);
    }
  };

  // Group schedules by position
  const groupSchedulesByPosition = (schedules: any[]): SchedulesByPosition => {
    const grouped: SchedulesByPosition = {};
    
    schedules.forEach(schedule => {
      const positionName = schedule.dhl_positions?.name || 'Ostatní';
      if (!grouped[positionName]) {
        grouped[positionName] = [];
      }
      grouped[positionName].push(schedule);
    });
    
    return grouped;
  };

  const renderScheduleCard = (schedule: any) => (
    <Card key={schedule.id} className="dhl-mobile-card mb-3">
      <CardHeader className="dhl-mobile-card-header">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="dhl-mobile-card-title flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="dhl-text-wrap">{schedule.schedule_name}</span>
              </CardTitle>
              <CardDescription className="dhl-mobile-card-description mt-1">
                Vytvořeno: {new Date(schedule.created_at).toLocaleDateString('cs-CZ')}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1 sm:flex-col sm:items-end">
              <Badge variant="secondary" className="text-xs">
                Woche {schedule.base_woche}
              </Badge>
              {schedule.is_active && (
                <Badge variant="default" className="text-xs">Aktivní</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="dhl-mobile-card-content">
        <div className="space-y-4">
          {/* Schedule Info - Mobile Layout */}
          <div className="dhl-mobile-schedule-grid">
            <div className="dhl-mobile-schedule-item">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="dhl-mobile-schedule-label">Pracovní skupina</div>
                  <div className="dhl-mobile-schedule-value dhl-text-wrap">
                    {schedule.dhl_work_groups?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Týden {schedule.dhl_work_groups?.week_number}
                  </div>
                </div>
              </div>
            </div>

            <div className="dhl-mobile-schedule-item">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="dhl-mobile-schedule-label">Referenční datum</div>
                  <div className="dhl-mobile-schedule-value">
                    {new Date(schedule.base_date).toLocaleDateString('cs-CZ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Info - Mobile Layout */}
          <div className="dhl-mobile-summary">
            <div className="dhl-mobile-summary-grid">
              <div className="dhl-mobile-summary-item">
                <span className="dhl-mobile-summary-label">Celkem směn:</span>
                <span className="dhl-mobile-summary-value">
                  {Object.keys(schedule.schedule_data).filter(key => 
                    key.match(/^\d{4}-\d{2}-\d{2}$/) && 
                    schedule.schedule_data[key].start_time
                  ).length}
                </span>
              </div>
              <div className="dhl-mobile-summary-item">
                <span className="dhl-mobile-summary-label">Období:</span>
                <span className="dhl-mobile-summary-value text-xs dhl-text-wrap">
                  {(() => {
                    const dates = Object.keys(schedule.schedule_data)
                      .filter(k => k.match(/^\d{4}-\d{2}-\d{2}$/))
                      .sort();
                    return dates.length > 0 ? 
                      `${dates[0]} - ${dates[dates.length - 1]}` : 
                      'N/A';
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions - Mobile Layout */}
          <div className="dhl-mobile-actions">
            <Button
              onClick={() => handleGenerateShifts(schedule.id)}
              disabled={generatingSchedule === schedule.id}
              className="dhl-mobile-button"
            >
              {generatingSchedule === schedule.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generuji...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Generovat směny
                </>
              )}
            </Button>
            
            <div className="dhl-mobile-button-group">
              <Button
                variant="outline"
                className="dhl-mobile-button-secondary"
                onClick={() => {
                  // TODO: Open edit dialog
                }}
              >
                <Settings className="h-3 w-3" />
                Upravit
              </Button>
              
              <Button
                variant="destructive"
                className="dhl-mobile-button-secondary"
                onClick={() => handleDelete(schedule.id)}
              >
                <Trash2 className="h-3 w-3" />
                Smazat
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Načítám plány směn...</p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <Card className="dhl-mobile-card">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Žádné plány směn</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Zatím nebyly importovány žádné plány směn.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Přepnout na záložku upload v DHLImportPanel
              window.dispatchEvent(new CustomEvent('switchToUploadTab'));
            }}
          >
            Importovat první plán
          </Button>
        </CardContent>
      </Card>
    );
  }

  const groupedSchedules = groupSchedulesByPosition(schedules);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-medium dhl-text-wrap">
          Plány směn podle pozic ({schedules.length} celkem)
        </h3>
        <Button onClick={loadSchedules} variant="outline" size="sm" className="w-full sm:w-auto">
          Obnovit
        </Button>
      </div>

      <Accordion type="multiple" value={openCategories} onValueChange={setOpenCategories}>
        {Object.entries(groupedSchedules).map(([positionName, positionSchedules]) => (
          <AccordionItem key={positionName} value={positionName} className="border rounded-lg mb-3">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Folder className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm sm:text-base dhl-text-wrap">
                    {positionName}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {positionSchedules.length} {positionSchedules.length === 1 ? 'plán' : 'plánů'}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {positionSchedules.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {positionSchedules.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Žádné plány pro tuto pozici</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {positionSchedules.map(schedule => renderScheduleCard(schedule))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
