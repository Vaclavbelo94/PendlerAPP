import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Download, Database, AlertCircle, CheckCircle, Loader2, Cog, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UnifiedShiftGeneratorService, ShiftGenerationResult } from '@/services/UnifiedShiftGeneratorService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DHLImportTabProps {
  onRefreshShifts?: () => void;
}

const DHLImportTab: React.FC<DHLImportTabProps> = ({ onRefreshShifts }) => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [lastImport, setLastImport] = useState<Date | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [generationResult, setGenerationResult] = useState<ShiftGenerationResult | null>(null);

  const handleGenerateShifts = async () => {
    if (!user?.id) return;
    
    setIsImporting(true);
    try {
      const result = await UnifiedShiftGeneratorService.generateShiftsForUser(user.id, 4);
      setGenerationResult(result);
      
      if (result.success && result.shifts.length > 0) {
        setShowPreviewDialog(true);
      } else {
        toast.error(result.error || t('import.noShiftsGenerated'));
      }
    } catch (error) {
      console.error('Error generating shifts:', error);
      toast.error(t('import.generationError'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportShifts = async () => {
    if (!generationResult?.shifts.length) return;
    
    setIsImporting(true);
    try {
      const saveResult = await UnifiedShiftGeneratorService.saveShifts(generationResult.shifts);
      
      if (saveResult.success) {
        setLastImport(new Date());
        setShowPreviewDialog(false);
        setGenerationResult(null);
        onRefreshShifts?.();
        toast.success(t('import.shiftsImported', { count: generationResult.shifts.length }));
      } else {
        toast.error(saveResult.error || t('import.saveError'));
      }
    } catch (error) {
      console.error('Error importing shifts:', error);
      toast.error(t('import.saveError'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setShowPreviewDialog(false);
    setGenerationResult(null);
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
          onClick={handleGenerateShifts} 
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {t('generating')}
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {t('import.generateShifts')}
            </>
          )}
        </Button>
        </CardContent>
      </Card>

      {/* Unified Shift Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            {t('import.title')}
          </CardTitle>
          <CardDescription>
            {t('import.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              {t('import.mobileInfo')}
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleGenerateShifts}
            disabled={isImporting}
            className="w-full"
            size="lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('import.generating')}
              </>
            ) : (
              <>
                <Cog className="h-4 w-4 mr-2" />
                {t('import.generateShifts')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informace o generování</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Univerzální generování pro všechny DHL pozice</p>
          <p>• Automatické rozpoznání typu pozice (Wechselschicht, standardní)</p>
          <p>• Směny budou označeny jako "DHL spravované"</p>
          <p>• Můžete je upravovat nebo mazat stejně jako běžné směny</p>
          <p>• Generování nepřepíše existující směny</p>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('import.preview.title')}</DialogTitle>
            <DialogDescription>
              {generationResult && t('import.preview.description', { count: generationResult.totalShifts })}
            </DialogDescription>
          </DialogHeader>

          {generationResult && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Typ pozice:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {generationResult.positionType === 'wechselschicht' ? 'Wechselschicht' : 
                     generationResult.positionType === 'regular' ? 'Standardní' : 'Automaticky rozpoznáno'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Období:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {generationResult.periodStart} - {generationResult.periodEnd}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generationResult?.shifts.map((shift, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {new Date(shift.date).toLocaleDateString('cs-CZ', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {shift.start_time} - {shift.end_time}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {t(`shiftTypes.${shift.type}`)}
                  </div>
                  {shift.notes && (
                    <div className="text-xs text-muted-foreground">
                      {shift.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelImport}
              disabled={isImporting}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleImportShifts}
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('importing')}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('import.confirmImport')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DHLImportTab;