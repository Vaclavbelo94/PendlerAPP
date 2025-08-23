import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { UnifiedShiftGeneratorService, ShiftGenerationResult } from '@/services/UnifiedShiftGeneratorService';
import { Download, CheckCircle, AlertCircle, Calendar, Clock, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface MobileDHLImportSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

const MobileDHLImportSheet: React.FC<MobileDHLImportSheetProps> = ({
  isOpen,
  onOpenChange,
  onImportComplete
}) => {
  const { t } = useTranslation(['shifts', 'profile']);
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ShiftGenerationResult | null>(null);
  const [step, setStep] = useState<'initial' | 'generating' | 'preview' | 'saving' | 'complete' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerateShifts = async () => {
    if (!user?.id) return;

    setIsGenerating(true);
    setStep('generating');
    setProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 80));
      }, 200);

      const result = await UnifiedShiftGeneratorService.generateShiftsForUser(user.id, 4);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResult(result);
      
      if (result.success && result.shifts.length > 0) {
        setStep('preview');
      } else {
        setErrorMessage(result.error || t('shifts:import.noShiftsGenerated'));
        setStep('error');
      }
    } catch (error) {
      console.error('Error generating shifts:', error);
      setErrorMessage(t('shifts:import.generationError'));
      setStep('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveShifts = async () => {
    if (!result || !result.shifts.length) return;

    setStep('saving');
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 100);

      const saveResult = await UnifiedShiftGeneratorService.saveShifts(result.shifts);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (saveResult.success) {
        setStep('complete');
        toast.success(t('shifts:import.shiftsImported', { count: result.shifts.length }));
        
        // Call the completion callback after a short delay
        setTimeout(() => {
          onImportComplete?.();
          onOpenChange(false);
          resetSheet();
        }, 2000);
      } else {
        setStep('preview');
        toast.error(saveResult.error || t('shifts:import.saveError'));
      }
    } catch (error) {
      console.error('Error saving shifts:', error);
      toast.error(t('shifts:import.saveError'));
      setStep('preview');
    }
  };

  const resetSheet = () => {
    setStep('initial');
    setResult(null);
    setProgress(0);
    setErrorMessage('');
  };

  const handleClose = () => {
    if (step === 'generating' || step === 'saving') return;
    onOpenChange(false);
    resetSheet();
  };

  const getPositionTypeDisplay = (positionType?: string) => {
    switch (positionType) {
      case 'wechselschicht':
        return { label: 'Wechselschicht', color: 'bg-blue-500' };
      case 'regular':
        return { label: 'Standardní pozice', color: 'bg-green-500' };
      default:
        return { label: 'Neznámá pozice', color: 'bg-gray-500' };
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('shifts:import.title')}
          </SheetTitle>
          <SheetDescription>
            {t('shifts:import.mobileDescription')}
          </SheetDescription>
        </SheetHeader>

        {/* Initial Step */}
        {step === 'initial' && (
          <div className="space-y-6">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                {t('shifts:import.mobileInfo')}
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleGenerateShifts}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('shifts:import.generateShifts')}
            </Button>
          </div>
        )}

        {/* Generating Step */}
        {step === 'generating' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium">{t('shifts:import.generateShifts')}</h3>
              <p className="text-muted-foreground text-sm mt-2">
                {t('shifts:import.analyzingSchedule')}
              </p>
            </div>
            
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && result && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t('shifts:import.generationSummary')}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {result.totalShifts} směn
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Pozice:</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getPositionTypeDisplay(result.positionType).color} text-white text-xs`}
                  >
                    {getPositionTypeDisplay(result.positionType).label}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Období:</span>
                  </div>
                  <span className="text-xs">
                    {result.periodStart} - {result.periodEnd}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Shifts Preview */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t('shifts:import.shiftsPreview')}</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {result.shifts.slice(0, 10).map((shift, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>{shift.date}</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{shift.start_time} - {shift.end_time}</span>
                        <Badge variant="outline" className="text-xs">
                          {t(`shifts:shiftTypes.${shift.type}`)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
                {result.shifts.length > 10 && (
                  <div className="text-center text-xs text-muted-foreground">
                    + {result.shifts.length - 10} dalších směn
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('initial')}
                className="flex-1"
              >
                {t('shifts:common.cancel')}
              </Button>
              <Button 
                onClick={handleSaveShifts}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('shifts:import.saveShifts')}
              </Button>
            </div>
          </div>
        )}

        {/* Saving Step */}
        {step === 'saving' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium">{t('shifts:import.savingShifts')}</h3>
              <p className="text-muted-foreground text-sm mt-2">
                {t('shifts:import.pleaseWait')}
              </p>
            </div>
            
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t('shifts:import.errorTitle')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {errorMessage}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                size="sm"
              >
                {t('shifts:common.cancel')}
              </Button>
              <Button
                onClick={() => {
                  setStep('initial');
                  setResult(null);
                  setErrorMessage('');
                }}
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('shifts:common.retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-600">
                {t('shifts:import.importComplete')}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                {t('shifts:import.shiftsImportedSuccessfully')}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileDHLImportSheet;