
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Share, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ScheduleShareDialog from '@/components/sharing/ScheduleShareDialog';

interface MobileShiftActionsProps {
  onQuickAdd: () => void;
  onNotificationSettings: () => void;
  onShareSchedule: () => void;
}

const MobileShiftActions = ({
  onQuickAdd,
  onNotificationSettings,
  onShareSchedule
}: MobileShiftActionsProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-card rounded-lg border">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">Rychlé akce</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onQuickAdd}
          className="flex items-center gap-2 justify-start"
        >
          <Plus className="h-4 w-4" />
          <span>Přidat směnu</span>
        </Button>
        
        <ScheduleShareDialog />
      </div>
    </div>
  );
};

export default MobileShiftActions;
