import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Download, Database, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DHLImportTab: React.FC = () => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [lastImport, setLastImport] = useState<Date | null>(null);

  const handleImportShifts = async () => {
    if (!user) {
      toast.error('Uživatel není přihlášen');
      return;
    }

    setIsImporting(true);
    
    try {
      // Get user's DHL assignment to know their position and work group
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_positions(*),
          dhl_work_groups(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (assignmentError || !assignment) {
        toast.error('Nebyla nalezena aktivní DHL pozice. Kontaktujte správce.');
        return;
      }

      // Get schedule data for the user's position and work group
      const { data: schedules, error: scheduleError } = await supabase
        .from('dhl_shift_schedules')
        .select('*')
        .eq('position_id', assignment.dhl_position_id)
        .eq('work_group_id', assignment.dhl_work_group_id);

      if (scheduleError) {
        console.error('Error fetching schedules:', scheduleError);
        toast.error('Chyba při načítání rozvrhu');
        return;
      }

      if (!schedules || schedules.length === 0) {
        toast.warning(t('import.noDataFound'));
        return;
      }

      // Process schedules and create shifts
      let importedCount = 0;
      const shiftsToImport = [];

      for (const schedule of schedules) {
        const scheduleData = schedule.schedule_data;
        
        // Parse schedule data and create shift records
        if (scheduleData && typeof scheduleData === 'object' && scheduleData !== null) {
          const data = scheduleData as any;
          if (data.shifts && Array.isArray(data.shifts)) {
            for (const shiftData of data.shifts) {
              shiftsToImport.push({
                user_id: user.id,
                date: shiftData.date,
                start_time: shiftData.start_time,
                end_time: shiftData.end_time,
                type: shiftData.type || 'morning',
                notes: `Importováno z DHL systému - ${assignment.dhl_positions?.name}`,
                dhl_position_id: assignment.dhl_position_id,
                dhl_work_group_id: assignment.dhl_work_group_id,
                is_dhl_managed: true,
                original_dhl_data: shiftData
              });
            }
          }
        }
      }

      if (shiftsToImport.length === 0) {
        toast.warning('V rozvrhu nebyly nalezeny žádné směny k importu');
        return;
      }

      // Insert shifts into database
      const { data: insertedShifts, error: insertError } = await supabase
        .from('shifts')
        .insert(shiftsToImport)
        .select();

      if (insertError) {
        console.error('Error inserting shifts:', insertError);
        toast.error('Chyba při importu směn: ' + insertError.message);
        return;
      }

      importedCount = insertedShifts?.length || 0;
      setLastImport(new Date());
      
      toast.success(t('import.importSuccess'), {
        description: `Importováno ${importedCount} směn z DHL systému`
      });

    } catch (error) {
      console.error('Import error:', error);
      toast.error(t('import.importError'));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('import.title')}
          </CardTitle>
          <CardDescription>
            {t('import.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Import načte směny z DHL databáze na základě vaší pozice a pracovní skupiny. 
              Existující směny nebudou ovlivněny.
            </AlertDescription>
          </Alert>

          {lastImport && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Poslední import: {lastImport.toLocaleString('cs-CZ')}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleImportShifts}
            disabled={isImporting}
            className="w-full"
            size="lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('import.importing')}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t('import.importButton')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informace o importu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Import načte směny na základě vaší DHL pozice a pracovní skupiny</p>
          <p>• Směny budou označeny jako "DHL spravované"</p>
          <p>• Můžete je upravovat nebo mazat stejně jako běžné směny</p>
          <p>• Import nepřepíše existující směny</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLImportTab;