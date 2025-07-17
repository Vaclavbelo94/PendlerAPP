import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Download, Database, AlertCircle, CheckCircle, Loader2, Cog, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWechselschichtGenerator } from '@/hooks/useWechselschichtGenerator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DHLImportTab: React.FC = () => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [lastImport, setLastImport] = useState<Date | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  const { 
    checkUserEligibility, 
    generateShiftsPreview, 
    executeGeneration, 
    isGenerating, 
    generationPreview 
  } = useWechselschichtGenerator();

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

  const handleWechselschichtGeneration = async () => {
    const eligibility = await checkUserEligibility();
    if (!eligibility) return;

    const preview = await generateShiftsPreview(4); // Generate 4 weeks ahead
    if (preview.length > 0) {
      setShowPreviewDialog(true);
    }
  };

  const confirmGeneration = async () => {
    const success = await executeGeneration(generationPreview);
    if (success) {
      setShowPreviewDialog(false);
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

      {/* Wechselschicht Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            Generování Wechselschicht směn
          </CardTitle>
          <CardDescription>
            Automatické generování směn pro Wechselschicht 30h pozice podle rotačního cyklu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              Generování funguje pouze pro uživatele s Wechselschicht pozicí. 
              Směny se vygenerují na 4 týdny dopředu podle vašeho aktuálního Woche cyklu.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleWechselschichtGeneration}
            disabled={isGenerating}
            className="w-full"
            variant="outline"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generuji směny...
              </>
            ) : (
              <>
                <Cog className="h-4 w-4 mr-2" />
                Generovat Wechselschicht směny
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

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Náhled generovaných směn</DialogTitle>
            <DialogDescription>
              Zkontrolujte si směny před jejich uložením do kalendáře.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {generationPreview.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Budou vygenerovány {generationPreview.length} směn:</h4>
                <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                  {generationPreview.map((shift, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                      <div>
                        <span className="font-medium">
                          {new Date(shift.date).toLocaleDateString('cs-CZ')}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({new Date(shift.date).toLocaleDateString('cs-CZ', { weekday: 'long' })})
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{shift.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {shift.start_time} - {shift.end_time}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Woche {shift.woche_number}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Zrušit
            </Button>
            <Button onClick={confirmGeneration} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generuji...
                </>
              ) : (
                'Potvrdit a vygenerovat'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DHLImportTab;