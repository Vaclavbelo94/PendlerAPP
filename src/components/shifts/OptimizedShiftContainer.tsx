import React, { useState } from 'react';
import { useShiftsManager } from '@/hooks/shifts/useShiftsManager';
import { useAuth } from '@/hooks/auth';
import { Shift } from '@/hooks/shifts/types';
import { LoadingBoundary } from '@/components/LoadingBoundary';
import { MobileShiftCalendar } from '@/components/shifts/calendar/MobileShiftCalendar';
import { ShiftCalendarSkeleton } from '@/components/ui/SkeletonComponents';
import { ResponsiveContainer } from '@/components/ui/ResponsiveComponents';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptimizedShiftContainerProps {
  onEditShift: (shift: Shift) => void;
  onAddShift: () => void;
  onAddShiftForDate: (date: Date) => void;
  onSelectedDateChange?: (date: Date | undefined) => void;
}

// Optimalizovaný container pro shifts s novým managementem
export const OptimizedShiftContainer: React.FC<OptimizedShiftContainerProps> = ({
  onEditShift,
  onAddShift,
  onAddShiftForDate,
  onSelectedDateChange
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Použij nový optimalizovaný shifts manager
  const {
    shifts,
    isLoading,
    isSaving,
    error,
    deleteShift,
    refreshShifts,
    stats
  } = useShiftsManager({
    userId: user?.id || null,
    enableRealtime: true,
    enableCache: true
  });

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    onSelectedDateChange?.(date);
  };

  const handleUpdateShift = (shiftId: string, shiftData: any) => {
    // Najdi shift a zavolej edit handler
    const shift = shifts.find(s => s.id === shiftId);
    if (shift) {
      onEditShift(shift);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    try {
      await deleteShift(shiftId);
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  // Error state
  if (error && !isLoading) {
    return (
      <ResponsiveContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshShifts}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Zkusit znovu
            </Button>
          </AlertDescription>
        </Alert>
      </ResponsiveContainer>
    );
  }

  return (
    <LoadingBoundary
      fallback={<ShiftCalendarSkeleton />}
    >
      <ResponsiveContainer maxWidth="2xl" padding="md">
        {/* Stats display (mobile hidden, desktop shown) */}
        <div className="hidden md:block mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalShifts}</div>
              <div className="text-sm text-muted-foreground">Celkem směn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.monthlyShifts}</div>
              <div className="text-sm text-muted-foreground">Tento měsíc</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.averageHours}h</div>
              <div className="text-sm text-muted-foreground">Průměr hodin</div>
            </div>
          </div>
        </div>

        {/* Main calendar */}
        <MobileShiftCalendar
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          shifts={shifts}
          onUpdateShift={handleUpdateShift}
          onDeleteShift={handleDeleteShift}
          onAddShiftForDate={onAddShiftForDate}
          isLoading={isLoading || isSaving}
        />

        {/* Mobile stats (shown only on mobile) */}
        <div className="md:hidden mt-6">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{stats.totalShifts}</div>
              <div className="text-xs text-muted-foreground">Celkem</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{stats.monthlyShifts}</div>
              <div className="text-xs text-muted-foreground">Měsíc</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{stats.averageHours}h</div>
              <div className="text-xs text-muted-foreground">Průměr</div>
            </div>
          </div>
        </div>

        {/* Floating add button for mobile */}
        <div className="md:hidden fixed bottom-6 right-6 z-30">
          <Button
            size="lg"
            onClick={onAddShift}
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <span className="text-xl">+</span>
          </Button>
        </div>
      </ResponsiveContainer>
    </LoadingBoundary>
  );
};