
import React from 'react';
import { CalendarDays } from 'lucide-react';
import ScheduleShareDialog from '@/components/sharing/ScheduleShareDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

export const ShiftsHeader = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('shifts');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t('shiftsManagement')}</h1>
        </div>
        
        {!isMobile && (
          <ScheduleShareDialog />
        )}
      </div>
      <p className="text-muted-foreground">
        {t('organizeAndTrackShifts')}
      </p>
    </div>
  );
};
