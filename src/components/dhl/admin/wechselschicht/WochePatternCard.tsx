import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Clock, Eye, EyeOff } from 'lucide-react';

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

interface WochePatternCardProps {
  pattern: WechselschichtPattern;
  onEdit: (pattern: WechselschichtPattern) => void;
  getShiftIcon: (shiftType: string | null) => React.ReactNode;
  getShiftBadgeColor: (shiftType: string | null) => string;
  getShiftLabel: (shiftType: string | null) => string;
}

const WochePatternCard: React.FC<WochePatternCardProps> = ({
  pattern,
  onEdit,
  getShiftIcon,
  getShiftBadgeColor,
  getShiftLabel
}) => {
  const days = [
    { key: 'monday_shift', label: 'Po' },
    { key: 'tuesday_shift', label: 'Út' },
    { key: 'wednesday_shift', label: 'St' },
    { key: 'thursday_shift', label: 'Čt' },
    { key: 'friday_shift', label: 'Pá' },
    { key: 'saturday_shift', label: 'So' },
    { key: 'sunday_shift', label: 'Ne' }
  ];

  const getWorkingDays = () => {
    return days.filter(day => pattern[day.key as keyof WechselschichtPattern] !== null).length;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      pattern.is_active ? 'ring-1 ring-green-200 bg-green-50/30 dark:bg-green-950/10' : 'opacity-75'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-600 text-white rounded-full text-sm font-bold">
              {pattern.woche_number}
            </div>
            <div>
              <CardTitle className="text-lg">{pattern.pattern_name}</CardTitle>
              {pattern.description && (
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pattern.is_active ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <Badge 
              variant={pattern.is_active ? "default" : "secondary"}
              className={pattern.is_active ? "bg-green-100 text-green-800" : ""}
            >
              {pattern.is_active ? 'Aktivní' : 'Neaktivní'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{pattern.weekly_hours}h/týden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-yellow-100 rounded border border-yellow-200 flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-800">{getWorkingDays()}</span>
            </div>
            <span>{getWorkingDays()} pracovních dnů</span>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Týdenní rozvrh</h4>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const shiftType = pattern[day.key as keyof WechselschichtPattern] as string | null;
              return (
                <div key={day.key} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{day.label}</div>
                  <div className={`
                    rounded-md border p-1 h-8 flex items-center justify-center
                    ${getShiftBadgeColor(shiftType)}
                  `}>
                    {getShiftIcon(shiftType)}
                  </div>
                  <div className="text-xs mt-1">
                    {getShiftLabel(shiftType)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shift Times */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Časy směn</h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                {getShiftIcon('morning')} Ranní:
              </span>
              <span>{pattern.morning_start_time} - {pattern.morning_end_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                {getShiftIcon('afternoon')} Odpolední:
              </span>
              <span>{pattern.afternoon_start_time} - {pattern.afternoon_end_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                {getShiftIcon('night')} Noční:
              </span>
              <span>{pattern.night_start_time} - {pattern.night_end_time}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t">
          <Button 
            onClick={() => onEdit(pattern)}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            <Edit className="h-4 w-4 mr-2" />
            Upravit vzorec
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WochePatternCard;