
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { VehicleData } from '@/types/vehicle';

interface VehicleActionsDropdownProps {
  vehicle: VehicleData;
  onEdit: (vehicle: VehicleData) => void;
  onDelete: (vehicle: VehicleData) => void;
}

const VehicleActionsDropdown: React.FC<VehicleActionsDropdownProps> = ({
  vehicle,
  onEdit,
  onDelete
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
          <Edit className="mr-2 h-4 w-4" />
          Upravit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(vehicle)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Smazat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleActionsDropdown;
