
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Bell, Clock, Calendar, Zap, User, AlertCircle, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/hooks/auth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { supabase } from '@/integrations/supabase/client';
import { generateUserShifts } from '@/services/dhl/shiftGenerator';

interface UserAssignment {
  id: string;
  dhl_position_id: string;
  dhl_work_group_id: string;
  is_active: boolean;
  dhl_positions: {
    name: string;
    position_type: string;
  };
  dhl_work_groups: {
    name: string;
    week_number: number;
  };
}

const ShiftsSettings: React.FC = () => {
  const { user } = useAuth();
  const { success, error: showError } = useStandardizedToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [userAssignment, setUserAssignment] = useState<UserAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (user?.id) {
      loadUserAssignment();
    }
  }, [user?.id]);

  const loadUserAssignment = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          dhl_positions(name, position_type),
          dhl_work_groups(name, week_number)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error loading user assignment:', error);
        return;
      }

      setUserAssignment(data);
    } catch (err) {
      console.error('Error loading user assignment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDHLShifts = useCallback(async () => {
    if (!user?.id) {
      showError('Chyba', 'Nejste přihlášeni');
      return;
    }

    if (!userAssignment) {
      showError('Chyba', 'Nemáte přiřazení DHL pozice');
      return;
    }

    setIsGenerating(true);
    try {
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

      const result = await generateUserShifts(user.id, startDate, endDate);

      if (result.success) {
        success(
          'Směny vygenerovány', 
          `Úspěšně vygenerováno ${result.generatedCount || 0} směn na další měsíc`
        );
      } else {
        showError('Chyba při generování směn', result.message);
      }
    } catch (err) {
      console.error('Error generating shifts:', err);
      showError('Chyba', 'Nepodařilo se vygenerovat směny');
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id, userAssignment, success, showError]);

  return (
    <div className="space-y-6">
      {/* DHL Generation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automatické generování směn
            </CardTitle>
            <CardDescription>
              Vygeneruje směny podle vašeho DHL plánu na další měsíc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Načítání DHL přiřazení...</span>
              </div>
            ) : userAssignment ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pozice:</span>
                    <Badge variant="secondary">
                      {userAssignment.dhl_positions.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Typ pozice:</span>
                    <Badge variant="outline">
                      {userAssignment.dhl_positions.position_type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pracovní skupina:</span>
                    <Badge variant="secondary">
                      {userAssignment.dhl_work_groups.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Číslo týdne:</span>
                    <Badge variant="outline">
                      Woche {userAssignment.dhl_work_groups.week_number}
                    </Badge>
                  </div>
                </div>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Máte aktivní DHL přiřazení. Můžete generovat směny automaticky.
                  </AlertDescription>
                </Alert>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Generuje směny na základě vašeho ročního plánu</p>
                  <p>• Zahrnuje všechny pracovní dny na další 30 dní</p>
                  <p>• Automaticky nastaví správné časy podle pozice</p>
                  <p>• Existující směny nebudou přepsány</p>
                </div>

                <Button
                  onClick={handleGenerateDHLShifts}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generuji směny...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Vygenerovat směny na měsíc
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nemáte přiřazené DHL pozice. Pro automatické generování směn je potřeba nastavit DHL profil v sekci DHL Setup.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Obecná nastavení směn
          </CardTitle>
          <CardDescription>
            Upravte si nastavení pro správu směn podle svých potřeb
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Upozornění na směny
                </Label>
                <p className="text-sm text-muted-foreground">
                  Dostávejte upozornění před začátkem směny
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Automatické směny
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automaticky vytvářet opakující se směny
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Synchronizace s kalendářem
                </Label>
                <p className="text-sm text-muted-foreground">
                  Synchronizovat směny s externím kalendářem
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>Další možnosti</CardTitle>
          <CardDescription>
            Pokročilé nastavení pro správu směn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium mb-1">Export směn</h4>
              <p className="text-xs text-muted-foreground">
                Exportovat směny do kalendáře
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium mb-1">Statistiky</h4>
              <p className="text-xs text-muted-foreground">
                Zobrazit přehled směn
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsSettings;
