import React from 'react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { MoreVertical, Edit, Trash2, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface MobileShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => Promise<void>;
}

const MobileShiftCard: React.FC<MobileShiftCardProps> = ({
  shift,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation('shifts');

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning':
        return t('morningShift');
      case 'afternoon':
        return t('afternoonShift');
      case 'night':
        return t('nightShift');
      case 'custom':
        return t('customShift');
      default:
        return t('noShift');
    }
  };

  const getShiftTypeColors = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-yellow-50 border-l-yellow-400 dark:bg-yellow-950/20';
      case 'afternoon':
        return 'bg-orange-50 border-l-orange-400 dark:bg-orange-950/20';
      case 'night':
        return 'bg-blue-50 border-l-blue-400 dark:bg-blue-950/20';
      case 'custom':
        return 'bg-purple-50 border-l-purple-400 dark:bg-purple-950/20';
      default:
        return 'bg-gray-50 border-l-gray-400 dark:bg-gray-950/20';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time.slice(0, 5); // Remove seconds
  };

  const calculateOvertime = () => {
    if (!shift.start_time || !shift.end_time) return 0;
    
    // Standard shift is 8 hours
    const start = new Date(`1970-01-01T${shift.start_time}`);
    const end = new Date(`1970-01-01T${shift.end_time}`);
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end.getTime() - start.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, hours - 8);
  };

  const overtime = calculateOvertime();

  return (
    <Card className={cn("border-l-4", getShiftTypeColors(shift.type))}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground">
                {getShiftTypeLabel(shift.type)}
              </h3>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {format(new Date(shift.date), 'EEE d.M.', { locale: cs })}
              </div>
            </div>

            <div className="space-y-2">
              {shift.start_time && shift.end_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatTime(shift.start_time)}–{formatTime(shift.end_time)}
                  </span>
                  {overtime > 0 && (
                    <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded-full text-xs font-medium">
                      {t('overtime')}: {overtime.toFixed(1)} h
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>DHL Halle 1</span>
              </div>

              {shift.notes && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                  {shift.notes}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(shift)}>
                <Edit className="h-4 w-4 mr-2" />
                {t('editShift')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => shift.id && onDelete(shift.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('deleteShift')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileShiftCard;