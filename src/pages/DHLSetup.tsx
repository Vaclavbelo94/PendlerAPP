import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Briefcase, User, Calendar, Info } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useDHLSetup } from '@/hooks/dhl/useDHLSetup';
import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { isDHLEmployeeSync } from '@/utils/dhlAuthUtils';
import { DHLPosition } from '@/types/dhl';
import { getCalendarWeek } from '@/utils/dhl/wocheCalculator';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DHLSetup() {
  const { user } = useAuth();
  const { isLoading, isSubmitting, error, submitSetup, canAccess, isSetupComplete } = useDHLSetup();
  const { success, error: showError } = useStandardizedToast();
  const navigate = useNavigate();

  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [currentWoche, setCurrentWoche] = useState('');
  const [personalNumber, setPersonalNumber] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching DHL setup data...');
        
        const positionsResult = await supabase
          .from('dhl_positions')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (positionsResult.error) throw positionsResult.error;

        console.log('Fetched positions:', positionsResult.data);
        setPositions((positionsResult.data || []) as DHLPosition[]);
      } catch (error) {
        console.error('Error fetching DHL data:', error);
        showError('Chyba při načítání dat', 'Nepodařilo se načíst DHL pozice');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPosition || !currentWoche) {
      showError('Neúplné údaje', 'Vyberte prosím pozici a zadejte aktuální Woche');
      return;
    }

    const wocheNumber = parseInt(currentWoche);
    if (wocheNumber < 1 || wocheNumber > 15) {
      showError('Neplatné Woche', 'Woche musí být číslo mezi 1 a 15');
      return;
    }

    const setupSuccess = await submitSetup({
      personalNumber,
      positionId: selectedPosition,
      currentWoche: wocheNumber
    });

    if (setupSuccess) {
      success('Nastavení uloženo', 'DHL nastavení bylo úspěšně uloženo');
      navigate('/dashboard');
    }
  };

  if (!user || !canAccess) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Přístup zamítnut. Pouze DHL zaměstnanci mají přístup k této stránce.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Načítání...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If setup already completed, redirect away from setup page
  useEffect(() => {
    if (!isLoading && isSetupComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isSetupComplete, navigate]);

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <CardTitle>DHL Nastavení</CardTitle>
          </div>
          <CardDescription>
            Nastavte si svou DHL pozici a aktuální Woche pro automatické generování směn
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Aktuální Woche:</strong> Zadejte jakou máte Woche tento týden (KW{getCalendarWeek(new Date())}). 
              Systém automaticky vypočítá směny pro následující týdny.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="personal-number">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Osobní číslo (volitelné)
                </div>
              </Label>
              <Input
                id="personal-number"
                placeholder="Zadejte vaše osobní číslo"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="position">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  DHL Pozice
                </div>
              </Label>
              <Select 
                value={selectedPosition} 
                onValueChange={setSelectedPosition}
                disabled={isLoadingData || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte svou pozici" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name} - {position.position_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="currentwoche">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Aktuální Woche (KW{getCalendarWeek(new Date()).toString().padStart(2, '0')})
                </div>
              </Label>
              <Select 
                value={currentWoche} 
                onValueChange={setCurrentWoche}
                disabled={isLoadingData || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte aktuální Woche" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((woche) => (
                    <SelectItem key={woche} value={woche.toString()}>
                      Woche {woche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Jaké Woche číslo máte aktuálně v kalendářním týdnu {getCalendarWeek(new Date())}? 
                Toto nastavení určí váš individuální rotační cyklus.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedPosition || !currentWoche || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Uložit nastavení
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}