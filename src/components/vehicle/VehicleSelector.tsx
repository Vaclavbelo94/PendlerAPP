
import React from 'react';
import { VehicleData } from '@/types/vehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleSelectorProps {
  vehicles: VehicleData[];
  selectedVehicleId: string | null;
  onSelect: (id: string) => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ vehicles, selectedVehicleId, onSelect }) => {
  if (vehicles.length === 0) return null;
  if (vehicles.length === 1) return null;

  return (
    <div className="w-full max-w-xs">
      <Select
        value={selectedVehicleId || undefined}
        onValueChange={onSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Vyberte vozidlo" />
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VehicleSelector;
