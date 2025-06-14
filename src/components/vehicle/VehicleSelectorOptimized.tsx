
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { VehicleData } from '@/types/vehicle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VehicleSelectorOptimizedProps {
  vehicles: VehicleData[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  onEdit: (vehicle: VehicleData) => void;
  onDelete: (vehicle: VehicleData) => void;
  className?: string;
}

const VehicleSelectorOptimized: React.FC<VehicleSelectorOptimizedProps> = ({
  vehicles,
  selectedVehicleId,
  onSelect,
  onEdit,
  onDelete,
  className
}) => {
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={selectedVehicleId || ''} onValueChange={onSelect}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Vyberte vozidlo">
            {selectedVehicle && `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.license_plate})`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id!}>
              {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedVehicle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(selectedVehicle)}>
              <Edit className="mr-2 h-4 w-4" />
              Upravit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(selectedVehicle)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Smazat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default VehicleSelectorOptimized;
