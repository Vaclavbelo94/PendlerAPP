
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Users, Settings, Trash2, Play } from 'lucide-react';
import { getDHLSchedules, deleteSchedule } from '@/services/dhl/dhlScheduleImporter';
import { generateShiftsFromSchedule } from '@/services/dhl/shiftGenerator';
import { toast } from 'sonner';

export const SchedulesList: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingSchedule, setGeneratingSchedule] = useState<string | null>(null);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await getDHLSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast.error('Chyba při načítání plánů směn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
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
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Žádné plány směn</h3>
          <p className="text-muted-foreground mb-4">
            Zatím nebyly importovány žádné plány směn.
          </p>
          <Button variant="outline">
            Importovat první plán
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Importované plány směn ({schedules.length})</h3>
        <Button onClick={loadSchedules} variant="outline" size="sm">
          Obnovit
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {schedule.schedule_name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Vytvořeno: {new Date(schedule.created_at).toLocaleDateString('cs-CZ')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Woche {schedule.base_woche}
                  </Badge>
                  {schedule.is_active && (
                    <Badge variant="default">Aktivní</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Schedule Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">{schedule.dhl_positions?.name}</div>
                      <div className="text-muted-foreground">{schedule.dhl_positions?.position_type}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">{schedule.dhl_work_groups?.name}</div>
                      <div className="text-muted-foreground">Týden {schedule.dhl_work_groups?.week_number}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">Referenční datum</div>
                      <div className="text-muted-foreground">
                        {new Date(schedule.base_date).toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Info */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Celkem směn: </span>
                      <span>{Object.keys(schedule.schedule_data).filter(key => 
                        key.match(/^\d{4}-\d{2}-\d{2}$/) && 
                        schedule.schedule_data[key].start_time
                      ).length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Období: </span>
                      <span>
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

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    onClick={() => handleGenerateShifts(schedule.id)}
                    disabled={generatingSchedule === schedule.id}
                    size="sm"
                  >
                    {generatingSchedule === schedule.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generuji...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generovat směny
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Open edit dialog
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Upravit
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(schedule.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Smazat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
