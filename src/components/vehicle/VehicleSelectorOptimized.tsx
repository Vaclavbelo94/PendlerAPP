
import React, { memo } from 'react';
import { VehicleData } from '@/types/vehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface VehicleSelectorProps {
  vehicles: VehicleData[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

const VehicleSelectorOptimized = memo<VehicleSelectorProps>(({ 
  vehicles, 
  selectedVehicleId, 
  onSelect, 
  className 
}) => {
  const isMobile = useIsMobile();

  if (vehicles.length === 0) return null;
  if (vehicles.length === 1) return null;

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <Select
        value={selectedVehicleId || undefined}
        onValueChange={onSelect}
      >
        <SelectTrigger className={cn(
          "flex items-center gap-2",
          isMobile ? "h-12 text-sm" : "h-10"
        )}>
          <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <SelectValue placeholder="Vyberte vozidlo">
            {selectedVehicle && (
              <span className="truncate">
                {selectedVehicle.brand} {selectedVehicle.model}
                {!isMobile && ` (${selectedVehicle.license_plate})`}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id!}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {vehicle.brand} {vehicle.model}
                </span>
                <span className="text-xs text-muted-foreground">
                  {vehicle.license_plate} • {vehicle.year}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

VehicleSelectorOptimized.displayName = 'VehicleSelectorOptimized';

export default VehicleSelectorOptimized;
