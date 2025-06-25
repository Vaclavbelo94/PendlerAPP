
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, Building2, Calendar } from 'lucide-react';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { DHLSetupFormData } from '@/types/dhl';
import { getPositionTypeIcon, getPositionTypeColor, formatHourlyRate } from '@/utils/dhl/dhlUtils';

interface DHLSetupFormProps {
  onSetupComplete: () => void;
}

const DHLSetupForm: React.FC<DHLSetupFormProps> = ({ onSetupComplete }) => {
  const { user } = useAuth();
  const { positions, workGroups, isLoading } = useDHLData();
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedPosition || !selectedWorkGroup) {
      toast.error('Prosím vyberte pozici a pracovní skupinu');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('=== DHL SETUP SUBMISSION ===');
      console.log('User ID:', user.id);
      console.log('Position ID:', selectedPosition);
      console.log('Work Group ID:', selectedWorkGroup);

      // Deaktivovat všechna existující přiřazení
      const { error: deactivateError } = await supabase
        .from('user_dhl_assignments')
        .update({ is_active: false })
        .eq('user_id', user.id);

      if (deactivateError) {
        console.error('Chyba při deaktivaci starých přiřazení:', deactivateError);
        throw deactivateError;
      }

      // Vytvořit nové přiřazení
      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .insert({
          user_id: user.id,
          dhl_position_id: selectedPosition,
          dhl_work_group_id: selectedWorkGroup,
          is_active: true
        })
        .select(`
          *,
          dhl_position:dhl_positions(*),
          dhl_work_group:dhl_work_groups(*)
        `)
        .single();

      if (assignmentError) {
        console.error('Chyba při vytváření přiřazení:', assignmentError);
        throw assignmentError;
      }

      console.log('DHL přiřazení vytvořeno:', assignment);

      // Vytvoření notifikace o úspěšném nastavení
      const selectedPos = positions.find(p => p.id === selectedPosition);
      const selectedWG = workGroups.find(wg => wg.id === selectedWorkGroup);

      const { error: notificationError } = await supabase
        .from('dhl_notifications')
        .insert({
          user_id: user.id,
          notification_type: 'shift_assigned',
          title: 'DHL Setup dokončen',
          message: `Byl jste přiřazen na pozici ${selectedPos?.name} ve skupině ${selectedWG?.name}. Vaše směny budou nyní automaticky spravovány.`,
          metadata: {
            position_id: selectedPosition,
            work_group_id: selectedWorkGroup,
            setup_date: new Date().toISOString()
          }
        });

      if (notificationError) {
        console.warn('Nepodařilo se vytvořit notifikaci:', notificationError);
      }

      toast.success('DHL setup byl úspěšně dokončen!', {
        description: `Přiřazeno: ${selectedPos?.name} - ${selectedWG?.name}`
      });

      onSetupComplete();

    } catch (error) {
      console.error('Chyba při DHL setup:', error);
      toast.error('Nastala chyba při nastavování DHL profilu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Načítám DHL data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-yellow-600" />
          DHL Profil Setup
        </CardTitle>
        <p className="text-muted-foreground">
          Vyberte svou pozici a pracovní skupinu pro automatické spravování směn.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Výběr pozice */}
          <div className="space-y-2">
            <Label htmlFor="position">DHL Pozice</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte svou pozici" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    <div className="flex items-center gap-2">
                      <span>{getPositionTypeIcon(position.position_type)}</span>
                      <div className="flex flex-col">
                        <span>{position.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatHourlyRate(position.hourly_rate)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPosition && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                {(() => {
                  const pos = positions.find(p => p.id === selectedPosition);
                  return pos ? (
                    <div>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPositionTypeColor(pos.position_type)}`}>
                        {pos.position_type.charAt(0).toUpperCase() + pos.position_type.slice(1)}
                      </div>
                      {pos.description && (
                        <p className="text-sm text-muted-foreground mt-1">{pos.description}</p>
                      )}
                      {pos.requirements && pos.requirements.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium">Požadavky:</p>
                          <ul className="text-xs text-muted-foreground list-disc list-inside">
                            {pos.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Výběr pracovní skupiny */}
          <div className="space-y-2">
            <Label htmlFor="workGroup">Pracovní skupina (Woche)</Label>
            <Select value={selectedWorkGroup} onValueChange={setSelectedWorkGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte pracovní skupinu" />
              </SelectTrigger>
              <SelectContent>
                {workGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{group.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Týden {group.week_number}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWorkGroup && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                {(() => {
                  const wg = workGroups.find(g => g.id === selectedWorkGroup);
                  return wg ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{wg.name}</span>
                      </div>
                      {wg.description && (
                        <p className="text-sm text-muted-foreground mt-1">{wg.description}</p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Informační zpráva */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Co se stane po nastavení:</p>
                <ul className="text-blue-700 mt-1 space-y-1">
                  <li>• Vaše směny budou automaticky spravovány podle DHL plánů</li>
                  <li>• Budete dostávat notifikace o změnách směn</li>
                  <li>• Můžete stále upravovat své směny ručně (označí se jako "override")</li>
                  <li>• Přístup k DHL specifickým funkcím a reportům</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedPosition || !selectedWorkGroup || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Nastavuji profil...
              </>
            ) : (
              'Dokončit DHL Setup'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DHLSetupForm;
