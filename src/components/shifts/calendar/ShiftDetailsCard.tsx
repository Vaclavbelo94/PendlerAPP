
import React from 'react';
import { format } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { Shift } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ShiftDetailsCardProps {
  selectedDate: Date;
  shift?: Shift;
  onAddShift: (date: Date) => void;
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
}

const ShiftDetailsCard: React.FC<ShiftDetailsCardProps> = ({
  selectedDate,
  shift,
  onAddShift,
  onEditShift,
  onDeleteShift
}) => {
  const { t, i18n } = useTranslation('shifts');

  // Get locale for date-fns based on current language
  const getLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      default: return cs;
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift') || 'Ranní směna';
      case 'afternoon': return t('afternoonShift') || 'Odpolední směna';
      case 'night': return t('nightShift') || 'Noční směna';
      case 'custom': return t('customShift') || 'Vlastní směna';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-500';
      case 'afternoon': return 'bg-amber-500';
      case 'night': return 'bg-indigo-500';
      case 'custom': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddShift = () => {
    onAddShift(selectedDate);
  };

  return (
    <div className="bg-muted/30 rounded-lg border p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-base">
          {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: getLocale() })}
        </h3>
        {!shift && (
          <Button
            size="sm"
            onClick={handleAddShift}
            className="flex items-center gap-1 h-8"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">{t('addShift') || 'Přidat'}</span>
          </Button>
        )}
      </div>
      
      {shift ? (
        <div className="space-y-3">
          {/* Shift info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className={cn("w-3 h-3 rounded", getShiftTypeColor(shift.type))}></div>
              <Clock className="h-3 w-3" />
              {getShiftTypeLabel(shift.type)}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              {shift.start_time} - {shift.end_time}
            </span>
          </div>
          
          {/* Notes */}
          {shift.notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border-l-4 border-primary/20">
              {shift.notes}
            </p>
          )}
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onEditShift && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditShift(shift)}
                className="flex items-center justify-center h-9 w-9 p-0"
                aria-label={t('editShift') || 'Upravit'}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDeleteShift && shift.id && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteShift(shift.id!)}
                className="flex items-center justify-center h-9 w-9 p-0"
                aria-label={t('deleteShift') || 'Smazat'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">
            {t('noShift') || 'Žádná směna'}
          </p>
          <Button
            onClick={handleAddShift}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            {t('addShift') || 'Přidat směnu'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShiftDetailsCard;
