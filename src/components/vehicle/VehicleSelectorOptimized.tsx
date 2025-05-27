
import React, { memo } from 'react';
import { VehicleData } from '@/types/vehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import VehicleActionsDropdown from './VehicleActionsDropdown';

interface VehicleSelectorProps {
  vehicles: VehicleData[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
  onEdit?: (vehicle: VehicleData) => void;
  onDelete?: (vehicle: VehicleData) => void;
  className?: string;
}

const VehicleSelectorOptimized = memo<VehicleSelectorProps>(({ 
  vehicles, 
  selectedVehicleId, 
  onSelect,
  onEdit,
  onDelete,
  className 
}) => {
  const isMobile = useIsMobile();

  if (vehicles.length === 0) return null;

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  if (vehicles.length === 1) {
    const vehicle = vehicles[0];
    return (
      <div className={cn("flex items-center justify-between p-3 border rounded-lg", className)}>
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {vehicle.brand} {vehicle.model}
            {!isMobile && ` (${vehicle.license_plate})`}
          </span>
        </div>
        {(onEdit || onDelete) && (
          <VehicleActionsDropdown
            vehicle={vehicle}
            onEdit={onEdit || (() => {})}
            onDelete={onDelete || (() => {})}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1">
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
      
      {selectedVehicle && (onEdit || onDelete) && (
        <VehicleActionsDropdown
          vehicle={selectedVehicle}
          onEdit={onEdit || (() => {})}
          onDelete={onDelete || (() => {})}
        />
      )}
    </div>
  );
});

VehicleSelectorOptimized.displayName = 'VehicleSelectorOptimized';

export default VehicleSelectorOptimized;
