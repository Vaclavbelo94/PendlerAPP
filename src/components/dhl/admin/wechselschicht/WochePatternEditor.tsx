import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, X, Clock } from 'lucide-react';

interface WechselschichtPattern {
  id: string;
  woche_number: number;
  pattern_name: string;
  description: string | null;
  monday_shift: string | null;
  tuesday_shift: string | null;
  wednesday_shift: string | null;
  thursday_shift: string | null;
  friday_shift: string | null;
  saturday_shift: string | null;
  sunday_shift: string | null;
  morning_start_time: string;
  morning_end_time: string;
  afternoon_start_time: string;
  afternoon_end_time: string;
  night_start_time: string;
  night_end_time: string;
  weekly_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WochePatternEditorProps {
  pattern: WechselschichtPattern;
  onSave: (pattern: WechselschichtPattern) => void;
  onCancel: () => void;
  getShiftIcon: (shiftType: string | null) => React.ReactNode;
  getShiftBadgeColor: (shiftType: string | null) => string;
  getShiftLabel: (shiftType: string | null) => string;
}

const WochePatternEditor: React.FC<WochePatternEditorProps> = ({
  pattern,
  onSave,
  onCancel,
  getShiftIcon,
  getShiftBadgeColor,
  getShiftLabel
}) => {
  const [editedPattern, setEditedPattern] = useState<WechselschichtPattern>({ ...pattern });

  const days = [
    { key: 'monday_shift', label: 'Pondělí' },
    { key: 'tuesday_shift', label: 'Úterý' },
    { key: 'wednesday_shift', label: 'Středa' },
    { key: 'thursday_shift', label: 'Čtvrtek' },
    { key: 'friday_shift', label: 'Pátek' },
    { key: 'saturday_shift', label: 'Sobota' },
    { key: 'sunday_shift', label: 'Neděle' }
  ];

  const shiftOptions = [
    { value: '', label: 'Volno' },
    { value: 'morning', label: 'Ranní směna' },
    { value: 'afternoon', label: 'Odpolední směna' },
    { value: 'night', label: 'Noční směna' }
  ];

  const handleInputChange = (field: keyof WechselschichtPattern, value: any) => {
    setEditedPattern(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShiftChange = (dayKey: string, shiftType: string) => {
    setEditedPattern(prev => ({
      ...prev,
      [dayKey]: shiftType === '' ? null : shiftType
    }));
  };

  const calculateWeeklyHours = () => {
    const shiftDurations = {
      morning: 8,
      afternoon: 8,
      night: 8
    };

    let totalHours = 0;
    days.forEach(day => {
      const shiftType = editedPattern[day.key as keyof WechselschichtPattern] as string | null;
      if (shiftType && shiftDurations[shiftType as keyof typeof shiftDurations]) {
        totalHours += shiftDurations[shiftType as keyof typeof shiftDurations];
      }
    });

    return totalHours;
  };

  const handleSave = () => {
    const calculatedHours = calculateWeeklyHours();
    onSave({
      ...editedPattern,
      weekly_hours: calculatedHours
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-600 text-white rounded-full text-sm font-bold">
              {editedPattern.woche_number}
            </div>
            Upravit Woche {editedPattern.woche_number} vzorec
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Základní informace</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pattern_name">Název vzorce</Label>
                <Input
                  id="pattern_name"
                  value={editedPattern.pattern_name}
                  onChange={(e) => handleInputChange('pattern_name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={editedPattern.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Volitelný popis vzorce..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editedPattern.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Aktivní vzorec</Label>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Celkem hodin týdně: {calculateWeeklyHours()}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Týdenní rozvrh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => {
                const currentShift = editedPattern[day.key as keyof WechselschichtPattern] as string | null;
                return (
                  <div key={day.key} className="space-y-2">
                    <Label>{day.label}</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={currentShift || ''}
                        onValueChange={(value) => handleShiftChange(day.key, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {shiftOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                {getShiftIcon(option.value || null)}
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge className={getShiftBadgeColor(currentShift)}>
                        {getShiftLabel(currentShift)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Shift Times */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Časy směn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Morning Shift */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getShiftIcon('morning')}
                    <h4 className="font-medium">Ranní směna</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="morning_start">Začátek</Label>
                    <Input
                      id="morning_start"
                      type="time"
                      value={editedPattern.morning_start_time}
                      onChange={(e) => handleInputChange('morning_start_time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="morning_end">Konec</Label>
                    <Input
                      id="morning_end"
                      type="time"
                      value={editedPattern.morning_end_time}
                      onChange={(e) => handleInputChange('morning_end_time', e.target.value)}
                    />
                  </div>
                </div>

                {/* Afternoon Shift */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getShiftIcon('afternoon')}
                    <h4 className="font-medium">Odpolední směna</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="afternoon_start">Začátek</Label>
                    <Input
                      id="afternoon_start"
                      type="time"
                      value={editedPattern.afternoon_start_time}
                      onChange={(e) => handleInputChange('afternoon_start_time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="afternoon_end">Konec</Label>
                    <Input
                      id="afternoon_end"
                      type="time"
                      value={editedPattern.afternoon_end_time}
                      onChange={(e) => handleInputChange('afternoon_end_time', e.target.value)}
                    />
                  </div>
                </div>

                {/* Night Shift */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getShiftIcon('night')}
                    <h4 className="font-medium">Noční směna</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="night_start">Začátek</Label>
                    <Input
                      id="night_start"
                      type="time"
                      value={editedPattern.night_start_time}
                      onChange={(e) => handleInputChange('night_start_time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="night_end">Konec</Label>
                    <Input
                      id="night_end"
                      type="time"
                      value={editedPattern.night_end_time}
                      onChange={(e) => handleInputChange('night_end_time', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Zrušit
          </Button>
          <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-700">
            <Save className="h-4 w-4 mr-2" />
            Uložit změny
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WochePatternEditor;