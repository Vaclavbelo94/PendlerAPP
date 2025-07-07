
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Calendar, Users, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateShiftsFromSchedule } from '@/services/dhl/shiftGenerator';

const BulkShiftGeneration: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalSchedules: number;
    generatedShifts: number;
  } | null>(null);

  const handleBulkGeneration = async () => {
    setIsGenerating(true);
    
    try {
      // Získat všechny aktivní plány směn
      const { data: schedules, error: schedulesError } = await supabase
        .from('dhl_shift_schedules')
        .select(`
          id,
          schedule_name,
          position_id,
          work_group_id,
          dhl_positions(name),
          dhl_work_groups(name)
        `)
        .eq('is_active', true);

      if (schedulesError) {
        throw new Error('Chyba při načítání plánů směn');
      }

      if (!schedules || schedules.length === 0) {
        toast.warning('Nebyly nalezeny žádné aktivní plány směn');
        return;
      }

      let totalGenerated = 0;
      let totalSkipped = 0;
      const results = [];

      // Generovat směny pro každý plán
      for (const schedule of schedules) {
        try {
          const result = await generateShiftsFromSchedule({
            scheduleId: schedule.id,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          });

          if (result.success) {
            totalGenerated += result.generatedCount || 0;
            totalSkipped += result.skippedCount || 0;
            results.push({
              schedule: schedule.schedule_name,
              generated: result.generatedCount || 0,
              skipped: result.skippedCount || 0
            });
          }
        } catch (error) {
          console.error(`Chyba při generování pro plán ${schedule.schedule_name}:`, error);
        }
      }

      setStats({
        totalUsers: results.length,
        totalSchedules: schedules.length,
        generatedShifts: totalGenerated
      });

      toast.success('Bulk generování dokončeno', {
        description: `Vygenerováno ${totalGenerated} směn, přeskočeno ${totalSkipped} existujících`
      });

    } catch (error) {
      console.error('Chyba při bulk generování:', error);
      toast.error('Chyba při generování směn');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk generování směn
          </CardTitle>
          <CardDescription>
            Vygeneruje směny pro všechny zaměstnance na základě jejich pozice a pracovní skupiny
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Od data</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Do data</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <Button 
            onClick={handleBulkGeneration}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generování probíhá...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Generovat všechny směny
              </>
            )}
          </Button>

          {stats && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                Výsledky generování
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">{stats.totalSchedules}</div>
                  <div className="text-muted-foreground">Plánů směn</div>
                </div>
                <div>
                  <div className="font-medium">{stats.generatedShifts}</div>
                  <div className="text-muted-foreground">Vygenerováno</div>
                </div>
                <div>
                  <div className="font-medium">{stats.totalUsers}</div>
                  <div className="text-muted-foreground">Zpracováno</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkShiftGeneration;
