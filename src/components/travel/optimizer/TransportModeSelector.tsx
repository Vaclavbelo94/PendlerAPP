
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Train, Bus, Bike } from 'lucide-react';
import { MobileOptimizedCard } from '@/components/ui/mobile-optimized-card';
import { cn } from '@/lib/utils';

interface TransportModeSelectorProps {
  selectedModes: string[];
  onModeToggle: (mode: string) => void;
}

const transportModes = [
  { id: 'car', label: 'Auto', icon: Car },
  { id: 'public', label: 'MHD', icon: Train },
  { id: 'bus', label: 'Autobus', icon: Bus },
  { id: 'bike', label: 'Kolo', icon: Bike }
];

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  selectedModes,
  onModeToggle
}) => {
  return (
    <MobileOptimizedCard title="Dopravní prostředky" compact>
      <div className="grid grid-cols-2 gap-2">
        {transportModes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedModes.includes(mode.id);
          
          return (
            <Button
              key={mode.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onModeToggle(mode.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 h-auto",
                "touch-target"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{mode.label}</span>
            </Button>
          );
        })}
      </div>
    </MobileOptimizedCard>
  );
};

export default TransportModeSelector;
