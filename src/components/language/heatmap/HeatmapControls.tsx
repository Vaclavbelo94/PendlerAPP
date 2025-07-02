
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeatmapControlsProps {
  weekOffset: number;
  setWeekOffset: (value: React.SetStateAction<number>) => void;
  description: string;
}

const HeatmapControls: React.FC<HeatmapControlsProps> = ({ 
  weekOffset, 
  setWeekOffset,
  description 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg flex items-center gap-2 font-semibold leading-none tracking-tight">
          Aktivita za týden
          {weekOffset === 0 && (
            <Badge variant="secondary" className="ml-2">Aktuální</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </div>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setWeekOffset(prev => prev - 1)}
          aria-label="Předchozí týden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setWeekOffset(0)}
          disabled={weekOffset === 0}
          aria-label="Aktuální týden"
        >
          <CalendarDays className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setWeekOffset(prev => prev + 1)}
          disabled={weekOffset >= 0}
          aria-label="Další týden"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HeatmapControls;
