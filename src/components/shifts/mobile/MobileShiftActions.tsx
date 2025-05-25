
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Bell, Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileShiftActionsProps {
  onQuickAdd: () => void;
  onNotificationSettings: () => void;
  onShareSchedule: () => void;
}

export const MobileShiftActions: React.FC<MobileShiftActionsProps> = ({
  onQuickAdd,
  onNotificationSettings,
  onShareSchedule
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleQuickAdd = () => {
    triggerHapticFeedback();
    onQuickAdd();
  };

  const handleNotificationSettings = () => {
    triggerHapticFeedback();
    onNotificationSettings();
  };

  const handleShareSchedule = () => {
    triggerHapticFeedback();
    onShareSchedule();
  };

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <h3 className="text-sm font-medium mb-3 text-primary">Rychlé akce</h3>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuickAdd}
          className="flex flex-col gap-1 h-auto py-3 mobile-touch-target"
        >
          <Calendar className="h-4 w-4" />
          <span className="text-xs">Přidat</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNotificationSettings}
          className="flex flex-col gap-1 h-auto py-3 mobile-touch-target"
        >
          <Bell className="h-4 w-4" />
          <span className="text-xs">Oznámení</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareSchedule}
          className="flex flex-col gap-1 h-auto py-3 mobile-touch-target"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Sdílet</span>
        </Button>
      </div>
    </Card>
  );
};
