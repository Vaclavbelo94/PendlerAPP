import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DHLShiftService } from '@/services/dhl/dhlShiftService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShiftConflict {
  date: string;
  shifts: Array<{
    id: string;
    type: string;
    is_dhl_managed: boolean;
    notes?: string;
    original_dhl_data?: any;
  }>;
  type: 'dhl_manual_conflict';
}

export const DHLConflictManager: React.FC = () => {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState<ShiftConflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolving, setIsResolving] = useState<string | null>(null);

  useEffect(() => {
    loadConflicts();
  }, [user]);

  const loadConflicts = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Check last week
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Check next month

      const conflictData = await DHLShiftService.checkShiftConflicts(
        user.id,
        startDate,
        endDate
      );

      setConflicts(conflictData);
    } catch (error) {
      console.error('Error loading conflicts:', error);
      toast.error('Chyba při načítání konfliktů');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveConflict = async (conflict: ShiftConflict, keepDHL: boolean) => {
    setIsResolving(conflict.date);
    
    try {
      const dhlShift = conflict.shifts.find(s => s.is_dhl_managed);
      const manualShift = conflict.shifts.find(s => !s.is_dhl_managed);

      if (keepDHL && manualShift) {
        // Delete manual shift, keep DHL
        const { error } = await supabase
          .from('shifts')
          .delete()
          .eq('id', manualShift.id);

        if (error) throw error;
        toast.success('Manuální směna byla odstraněna, ponechána DHL směna');
      } else if (!keepDHL && dhlShift) {
        // Delete DHL shift, keep manual
        const { error } = await supabase
          .from('shifts')
          .delete()
          .eq('id', dhlShift.id);

        if (error) throw error;
        toast.success('DHL směna byla odstraněna, ponechána manuální směna');
      }

      // Reload conflicts
      await loadConflicts();
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast.error('Chyba při řešení konfliktu');
    } finally {
      setIsResolving(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Konflikty směn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Načítám konflikty...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conflicts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            Konflikty směn
          </CardTitle>
          <CardDescription>
            Žádné konflikty mezi DHL a manuálními směnami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Všechny směny jsou v pořádku. Nejsou zjištěny žádné konflikty.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Konflikty směn
        </CardTitle>
        <CardDescription>
          Nalezeno {conflicts.length} konfliktů mezi DHL a manuálními směnami
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {conflicts.map((conflict) => {
          const dhlShift = conflict.shifts.find(s => s.is_dhl_managed);
          const manualShift = conflict.shifts.find(s => !s.is_dhl_managed);

          return (
            <div key={conflict.date} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{conflict.date}</span>
                  <Badge variant="destructive">Konflikt</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DHL Shift */}
                {dhlShift && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-100 text-yellow-800">DHL</Badge>
                      <span className="text-sm font-medium">{dhlShift.type}</span>
                    </div>
                    {dhlShift.original_dhl_data && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {dhlShift.original_dhl_data.start_time} - {dhlShift.original_dhl_data.end_time}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Shift */}
                {manualShift && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">Manuální</Badge>
                      <span className="text-sm font-medium">{manualShift.type}</span>
                    </div>
                    {manualShift.notes && (
                      <div className="text-sm text-muted-foreground">
                        <User className="h-3 w-3 inline mr-1" />
                        {manualShift.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resolveConflict(conflict, true)}
                  disabled={isResolving === conflict.date}
                  className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                >
                  Ponechat DHL směnu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resolveConflict(conflict, false)}
                  disabled={isResolving === conflict.date}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Ponechat manuální směnu
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DHLConflictManager;
