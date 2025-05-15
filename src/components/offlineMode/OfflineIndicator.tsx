
import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className }) => {
  const { isOffline, lastOnlineAt } = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-background px-3 py-1 flex items-center gap-1.5 border-amber-500">
            <WifiOff className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-amber-500 font-medium">Offline</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="left">
          <div className="text-sm">
            <div className="font-medium mb-1">Offline režim</div>
            <div className="text-xs text-muted-foreground">
              Pracujete v offline režimu.
              {lastOnlineAt && (
                <div>Naposledy online: {format(lastOnlineAt, 'HH:mm, dd.MM.yyyy')}</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default OfflineIndicator;
