import React, { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SwipeableCalendar } from "./calendar/SwipeableCalendar";
import { format } from "date-fns";
import { cs, de, pl } from 'date-fns/locale';
import { CalendarDays, Clock, FileText, Trash2 } from "lucide-react";
import { Shift, ShiftType } from "./types";
import { useTranslation } from 'react-i18next';

interface ShiftCalendarTabProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: Shift[];
  currentShift?: Shift | null;
  shiftType: ShiftType;
  setShiftType: (type: ShiftType) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
  user: any;
  onSaveShift: () => void;
  onDeleteShift: () => void;
  onOpenNoteDialog: () => void;
}

export const ShiftCalendarTab = React.memo<ShiftCalendarTabProps>(({
  selectedDate,
  onSelectDate,
  shifts,
  currentShift,
  shiftType,
  setShiftType,
  shiftNotes,
  setShiftNotes,
  user,
  onSaveShift,
  onDeleteShift,
  onOpenNoteDialog
}) => {
  const { t, i18n } = useTranslation('shifts');

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  // Memoized function for getting shifts for a specific date
  const getShiftsForDate = useCallback((date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.toDateString() === date.toDateString();
    });
  }, [shifts]);

  // Create styled dates for calendar
  const styledDates = useMemo(() => {
    return shifts.map(shift => new Date(shift.date));
  }, [shifts]);

  const handleMonthChange = useCallback((date: Date) => {
    console.log('Month changed to:', format(date, 'MMMM yyyy', { locale: getDateLocale() }));
  }, [getDateLocale]);

  const handleShiftTypeChange = useCallback((value: ShiftType) => {
    setShiftType(value);
  }, [setShiftType]);

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setShiftNotes(e.target.value);
  }, [setShiftNotes]);

  const getShiftTypeLabel = (type: ShiftType) => {
    switch (type) {
      case 'morning': return t('morningShift');
      case 'afternoon': return t('afternoonShift');
      case 'night': return t('nightShift');
      default: return type;
    }
  };

  // Loading skeleton component
  const CalendarSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  const DetailSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  // Show loading state if shifts are being loaded
  if (!shifts && shifts !== null) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {t('shiftsCalendar')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarSkeleton />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('shiftDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {t('shiftsCalendar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SwipeableCalendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            onMonthChange={handleMonthChange}
            className="rounded-md border"
          />
          
          {selectedDate && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">
                {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: getDateLocale() })}
              </h3>
              {currentShift ? (
                <div className="space-y-2">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <Clock className="h-3 w-3" />
                    {getShiftTypeLabel(currentShift.type)}
                  </Badge>
                  {currentShift.notes && (
                    <p className="text-sm text-muted-foreground">
                      <FileText className="h-3 w-3 inline mr-1" />
                      {currentShift.notes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t('noShift')}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shift Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentShift ? t('editShift') : t('addShift')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('shiftType')}</label>
                <Select value={shiftType} onValueChange={handleShiftTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectShiftType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">{t('types.morning')}</SelectItem>
                    <SelectItem value="afternoon">{t('types.afternoon')}</SelectItem>
                    <SelectItem value="night">{t('types.night')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('notes')}</label>
                <Textarea 
                  placeholder={t('optionalShiftNote')}
                  value={shiftNotes}
                  onChange={handleNotesChange}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={onSaveShift} className="flex-1">
                  {currentShift ? t('updateShift') : t('saveShift')}
                </Button>
                {currentShift && (
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={onDeleteShift}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('selectDate')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

ShiftCalendarTab.displayName = 'ShiftCalendarTab';
