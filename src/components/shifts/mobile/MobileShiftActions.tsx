
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Share, Settings, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import ScheduleShareDialog from '@/components/sharing/ScheduleShareDialog';

interface MobileShiftActionsProps {
  onQuickAdd: () => void;
  onNotificationSettings: () => void;
  onShareSchedule: () => void;
  userAssignment?: any;
  handleGenerateDHLShifts?: () => void;
  isDHLGenerating?: boolean;
}

const MobileShiftActions = ({
  onQuickAdd,
  onNotificationSettings,
  onShareSchedule,
  userAssignment,
  handleGenerateDHLShifts,
  isDHLGenerating
}: MobileShiftActionsProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('shifts');

  if (!isMobile) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-card rounded-lg border">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t('quickActions', 'Rychlé akce')}</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onQuickAdd}
          className="flex items-center gap-2 justify-start min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          <span>{t('addShift')}</span>
        </Button>
        
        <ScheduleShareDialog />
        
        {userAssignment && handleGenerateDHLShifts && (
          <Button
            onClick={handleGenerateDHLShifts}
            disabled={isDHLGenerating}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 justify-start min-h-[44px] col-span-2"
          >
            <Zap className="h-4 w-4" />
            <span>{isDHLGenerating ? 'Generuji...' : 'Generovat DHL směny'}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileShiftActions;
