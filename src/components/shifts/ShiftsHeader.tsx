
import React from 'react';
import { CalendarDays } from 'lucide-react';
import ScheduleShareDialog from '@/components/sharing/ScheduleShareDialog';
import { useIsMobile } from '@/hooks/use-mobile';

export const ShiftsHeader = () => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Správa směn</h1>
        </div>
        
        {/* Desktop share button */}
        {!isMobile && (
          <ScheduleShareDialog />
        )}
      </div>
      <p className="text-muted-foreground">
        Organizujte a sledujte své pracovní směny
      </p>
    </div>
  );
};
