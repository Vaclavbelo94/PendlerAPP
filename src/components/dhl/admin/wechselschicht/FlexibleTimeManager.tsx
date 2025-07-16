import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  Bell, 
  Users, 
  Calendar,
  Send,
  AlertTriangle,
  CheckCircle,
  Sunrise,
  Sun,
  Moon,
  Plus,
  Minus
} from 'lucide-react';
import type { DHLWechselschichtPattern, DHLShiftTimeChange } from '@/types/dhl';

interface FlexibleTimeManagerProps {
  patterns: DHLWechselschichtPattern[];
  onTimeChange?: (change: DHLShiftTimeChange) => void;
}

interface TimeAdjustment {
  woche_number: number;
  date: string;
  shift_type: 'morning' | 'afternoon' | 'night';
  adjustment_minutes: number;
  reason: string;
}

const FlexibleTimeManager: React.FC<FlexibleTimeManagerProps> = ({ 
  patterns, 
  onTimeChange 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeAdjustments, setTimeAdjustments] = useState<TimeAdjustment[]>([]);
  const [newAdjustment, setNewAdjustment] = useState<TimeAdjustment>({
    woche_number: 1,
    date: new Date().toISOString().split('T')[0],
    shift_type: 'morning',
    adjustment_minutes: 0,
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [affectedEmployees, setAffectedEmployees] = useState<any[]>([]);

  useEffect(() => {
    loadTimeChangesForDate(selectedDate);
    loadAffectedEmployees();
  }, [selectedDate]);

  const loadTimeChangesForDate = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('dhl_shift_time_changes')
        .select('*')
        .eq('change_date', date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert to TimeAdjustment format
      const adjustments = data?.map(change => ({
        woche_number: change.woche_number,
        date: change.change_date,
        shift_type: change.shift_type as 'morning' | 'afternoon' | 'night',
        adjustment_minutes: calculateAdjustmentMinutes(
          change.original_start_time,
          change.new_start_time
        ),
        reason: change.reason || ''
      })) || [];
      
      setTimeAdjustments(adjustments);
    } catch (error) {
      console.error('Error loading time changes:', error);
    }
  };

  const loadAffectedEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            email
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      setAffectedEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const calculateAdjustmentMinutes = (originalTime: string, newTime: string): number => {
    const original = new Date(`2000-01-01 ${originalTime}`);
    const updated = new Date(`2000-01-01 ${newTime}`);
    return Math.round((updated.getTime() - original.getTime()) / (1000 * 60));
  };

  const getAdjustedTime = (originalTime: string, adjustmentMinutes: number): string => {
    const [hours, minutes] = originalTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + adjustmentMinutes, 0, 0);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getShiftIcon = (shiftType: string) => {
    switch (shiftType) {
      case 'morning':
        return <Sunrise className="h-4 w-4 text-yellow-600" />;
      case 'afternoon':
        return <Sun className="h-4 w-4 text-orange-600" />;
      case 'night':
        return <Moon className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAffectedEmployeesForWoche = (wocheNumber: number) => {
    return affectedEmployees.filter(emp => emp.current_woche === wocheNumber);
  };

  const handleAddAdjustment = () => {
    if (!newAdjustment.reason.trim()) {
      toast.error('Zadejte prosím důvod změny času');
      return;
    }

    setTimeAdjustments(prev => [...prev, { ...newAdjustment }]);
    setNewAdjustment({
      woche_number: 1,
      date: selectedDate,
      shift_type: 'morning',
      adjustment_minutes: 0,
      reason: ''
    });
  };

  const handleRemoveAdjustment = (index: number) => {
    setTimeAdjustments(prev => prev.filter((_, i) => i !== index));
  };

  const handleApplyChanges = async () => {
    if (timeAdjustments.length === 0) {
      toast.error('Nejsou žádné změny k aplikování');
      return;
    }

    setLoading(true);
    
    try {
      // Apply each time adjustment
      for (const adjustment of timeAdjustments) {
        const pattern = patterns.find(p => p.woche_number === adjustment.woche_number);
        if (!pattern) continue;

        const originalTime = pattern[`${adjustment.shift_type}_start_time` as keyof DHLWechselschichtPattern] as string;
        const originalEndTime = pattern[`${adjustment.shift_type}_end_time` as keyof DHLWechselschichtPattern] as string;
        
        const newStartTime = getAdjustedTime(originalTime, adjustment.adjustment_minutes);
        const newEndTime = getAdjustedTime(originalEndTime, adjustment.adjustment_minutes);

        // Save to database
        const { error } = await supabase
          .from('dhl_shift_time_changes')
          .insert({
            woche_number: adjustment.woche_number,
            change_date: adjustment.date,
            shift_type: adjustment.shift_type,
            original_start_time: originalTime,
            new_start_time: newStartTime,
            original_end_time: originalEndTime,
            new_end_time: newEndTime,
            reason: adjustment.reason,
            admin_user_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;

        // Send notifications to affected employees
        await sendNotifications(adjustment, originalTime, newStartTime);
      }

      toast.success(`Aplikováno ${timeAdjustments.length} změn času směn`);
      setTimeAdjustments([]);
      loadTimeChangesForDate(selectedDate);
      
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error('Chyba při aplikování změn');
    } finally {
      setLoading(false);
    }
  };

  const sendNotifications = async (
    adjustment: TimeAdjustment, 
    originalTime: string, 
    newTime: string
  ) => {
    const employees = getAffectedEmployeesForWoche(adjustment.woche_number);
    
    for (const employee of employees) {
      // Create notification
      const message = `🔄 ZMĚNA ČASU: ${getShiftTypeName(adjustment.shift_type)} směna ${adjustment.date} přesunuta z ${originalTime} na ${newTime}. Důvod: ${adjustment.reason}`;
      
      await supabase
        .from('notifications')
        .insert({
          user_id: employee.user_id,
          title: 'Změna času směny',
          message,
          type: 'shift_time_change',
          related_to: {
            type: 'time_change',
            woche_number: adjustment.woche_number,
            date: adjustment.date,
            shift_type: adjustment.shift_type,
            original_time: originalTime,
            new_time: newTime
          }
        });
    }
  };

  const getShiftTypeName = (shiftType: string) => {
    switch (shiftType) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední';
      case 'night': return 'Noční';
      default: return shiftType;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Flexibilní časy směn</h3>
        <p className="text-sm text-muted-foreground">
          Denní aktualizace časů směn s automatickými notifikacemi zaměstnancům
        </p>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Výběr data pro změny
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="selectedDate">Datum změn</Label>
              <Input
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Aktuální změny: {timeAdjustments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Přidat změnu času
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Woche číslo</Label>
              <Select
                value={newAdjustment.woche_number.toString()}
                onValueChange={(value) => setNewAdjustment(prev => ({
                  ...prev,
                  woche_number: parseInt(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {patterns.map(pattern => (
                    <SelectItem key={pattern.woche_number} value={pattern.woche_number.toString()}>
                      Woche {pattern.woche_number} - {pattern.pattern_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Typ směny</Label>
              <Select
                value={newAdjustment.shift_type}
                onValueChange={(value: 'morning' | 'afternoon' | 'night') => 
                  setNewAdjustment(prev => ({ ...prev, shift_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-4 w-4" />
                      Ranní směna
                    </div>
                  </SelectItem>
                  <SelectItem value="afternoon">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Odpolední směna
                    </div>
                  </SelectItem>
                  <SelectItem value="night">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Noční směna
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Úprava času (minuty)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAdjustment(prev => ({
                    ...prev,
                    adjustment_minutes: Math.max(-60, prev.adjustment_minutes - 15)
                  }))}
                  disabled={newAdjustment.adjustment_minutes <= -60}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <Badge 
                    variant={newAdjustment.adjustment_minutes === 0 ? "secondary" : 
                            newAdjustment.adjustment_minutes > 0 ? "default" : "destructive"}
                  >
                    {newAdjustment.adjustment_minutes > 0 ? '+' : ''}{newAdjustment.adjustment_minutes}min
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAdjustment(prev => ({
                    ...prev,
                    adjustment_minutes: Math.min(60, prev.adjustment_minutes + 15)
                  }))}
                  disabled={newAdjustment.adjustment_minutes >= 60}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Dotčení zaměstnanci</Label>
              <div className="text-sm text-muted-foreground">
                {getAffectedEmployeesForWoche(newAdjustment.woche_number).length} osob
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Důvod změny</Label>
            <Textarea
              id="reason"
              placeholder="Zadejte důvod změny času směny..."
              value={newAdjustment.reason}
              onChange={(e) => setNewAdjustment(prev => ({
                ...prev,
                reason: e.target.value
              }))}
            />
          </div>

          <Button onClick={handleAddAdjustment} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Přidat změnu
          </Button>
        </CardContent>
      </Card>

      {/* Current Adjustments */}
      {timeAdjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Plánované změny pro {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeAdjustments.map((adjustment, index) => {
                const pattern = patterns.find(p => p.woche_number === adjustment.woche_number);
                const originalTime = pattern?.[`${adjustment.shift_type}_start_time` as keyof DHLWechselschichtPattern] as string;
                const newTime = originalTime ? getAdjustedTime(originalTime, adjustment.adjustment_minutes) : '';
                const affectedCount = getAffectedEmployeesForWoche(adjustment.woche_number).length;

                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getShiftIcon(adjustment.shift_type)}
                      <div>
                        <div className="font-medium">
                          Woche {adjustment.woche_number} - {getShiftTypeName(adjustment.shift_type)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {originalTime} → {newTime} ({adjustment.adjustment_minutes > 0 ? '+' : ''}{adjustment.adjustment_minutes}min)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {adjustment.reason} • {affectedCount} zaměstnanců
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAdjustment(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button 
                onClick={handleApplyChanges} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Aplikování změn...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Aplikovat změny a odeslat notifikace
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Automatické notifikace
              </p>
              <p className="text-blue-700 dark:text-blue-200">
                Při aplikování změn budou automaticky odeslány SMS a push notifikace 
                všem zaměstnancům v dotčených Woche skupinách.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlexibleTimeManager;