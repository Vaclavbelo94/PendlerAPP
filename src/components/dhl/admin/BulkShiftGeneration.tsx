
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
      console.log('=== BULK SHIFT GENERATION ===');
      console.log('Date range:', dateRange);

      // Místo generování podle plánů, generujeme podle uživatelů
      // Najdeme všechny aktivní DHL přiřazení uživatelů
      const { data: userAssignments, error: assignmentsError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          user_id,
          dhl_position_id,
          dhl_work_group_id,
          current_woche,
          reference_woche,
          dhl_positions(name),
          dhl_work_groups(name),
          profiles(email, username)
        `)
        .eq('is_active', true);

      if (assignmentsError) {
        console.error('Error fetching user assignments:', assignmentsError);
        throw new Error('Chyba při načítání přiřazení uživatelů');
      }

      if (!userAssignments || userAssignments.length === 0) {
        toast.warning('Nebyli nalezeni žádní uživatelé s aktivním DHL přiřazením');
        return;
      }

      console.log(`Found ${userAssignments.length} active user assignments`);

      let totalGenerated = 0;
      let totalSkipped = 0;
      const results = [];

      // Import generateUserShifts function
      const { generateUserShifts } = await import('@/services/dhl/shiftGenerator');

      // Generovat směny pro každého uživatele
      for (const assignment of userAssignments) {
        try {
          console.log(`Generating shifts for user: ${assignment.profiles?.email || assignment.user_id}`);
          
          const result = await generateUserShifts(
            assignment.user_id,
            dateRange.startDate,
            dateRange.endDate
          );

          if (result.success) {
            totalGenerated += result.generatedCount || 0;
            totalSkipped += result.skippedCount || 0;
            results.push({
              user: assignment.profiles?.email || assignment.profiles?.username || assignment.user_id,
              position: assignment.dhl_positions?.name || 'Unknown',
              workGroup: assignment.dhl_work_groups?.name || 'Individual',
              generated: result.generatedCount || 0,
              skipped: result.skippedCount || 0
            });
          } else {
            console.log(`Failed to generate shifts for user ${assignment.user_id}: ${result.message}`);
            results.push({
              user: assignment.profiles?.email || assignment.profiles?.username || assignment.user_id,
              position: assignment.dhl_positions?.name || 'Unknown',
              workGroup: assignment.dhl_work_groups?.name || 'Individual',
              generated: 0,
              skipped: 0,
              error: result.message
            });
          }
        } catch (error) {
          console.error(`Chyba při generování pro uživatele ${assignment.user_id}:`, error);
          results.push({
            user: assignment.profiles?.email || assignment.profiles?.username || assignment.user_id,
            position: assignment.dhl_positions?.name || 'Unknown',
            workGroup: assignment.dhl_work_groups?.name || 'Individual',
            generated: 0,
            skipped: 0,
            error: error instanceof Error ? error.message : 'Neznámá chyba'
          });
        }
      }

      setStats({
        totalUsers: results.length,
        totalSchedules: userAssignments.length,
        generatedShifts: totalGenerated
      });

      console.log('=== BULK GENERATION RESULTS ===');
      console.log('Results:', results);
      console.log('Total generated:', totalGenerated);
      console.log('Total skipped:', totalSkipped);

      const successfulUsers = results.filter(r => r.generated > 0).length;
      const failedUsers = results.filter(r => r.error).length;

      toast.success('Bulk generování dokončeno', {
        description: `Úspěšně: ${successfulUsers} uživatelů, Chyby: ${failedUsers}, Vygenerováno: ${totalGenerated} směn, Přeskočeno: ${totalSkipped}`
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
                  <div className="text-muted-foreground">Uživatelů</div>
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
