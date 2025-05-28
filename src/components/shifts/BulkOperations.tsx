
import React from 'react';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { SelectionHeader } from './bulk/SelectionHeader';
import { BulkActionButtons } from './bulk/BulkActionButtons';
import { ShiftsList } from './bulk/ShiftsList';

interface BulkOperationsProps {
  shifts: Shift[];
  selectedShifts: string[];
  onShiftSelect: (shiftId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: (shiftIds: string[]) => void;
  onBulkEdit: (shiftIds: string[]) => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  shifts,
  selectedShifts,
  onShiftSelect,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkEdit
}) => {
  return (
    <div className="space-y-4">
      <SelectionHeader
        selectedCount={selectedShifts.length}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />
      
      <BulkActionButtons
        selectedCount={selectedShifts.length}
        onBulkEdit={onBulkEdit}
        onBulkDelete={onBulkDelete}
        selectedShifts={selectedShifts}
      />

      <ShiftsList
        shifts={shifts}
        selectedShifts={selectedShifts}
        onShiftSelect={onShiftSelect}
      />
    </div>
  );
};

export default BulkOperations;
