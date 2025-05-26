
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Filters {
  startDate: string | null;
  endDate: string | null;
  shiftType: string;
  location: string;
  minHours: number;
  maxHours: number;
}

interface ShiftFiltersProps {
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onCancel: () => void;
}

const ShiftFilters = ({ filters, onApplyFilters, onCancel }: ShiftFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: null,
      endDate: null,
      shiftType: 'all',
      location: 'all',
      minHours: 0,
      maxHours: 24
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="startDate">Od data</Label>
          <Input
            id="startDate"
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="endDate">Do data</Label>
          <Input
            id="endDate"
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
          />
        </div>

        <div>
          <Label>Typ směny</Label>
          <Select 
            value={localFilters.shiftType} 
            onValueChange={(value) => setLocalFilters({ ...localFilters, shiftType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny</SelectItem>
              <SelectItem value="morning">Ranní</SelectItem>
              <SelectItem value="afternoon">Odpolední</SelectItem>
              <SelectItem value="night">Noční</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minHours">Min. hodin</Label>
            <Input
              id="minHours"
              type="number"
              min="0"
              max="24"
              value={localFilters.minHours}
              onChange={(e) => setLocalFilters({ ...localFilters, minHours: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="maxHours">Max. hodin</Label>
            <Input
              id="maxHours"
              type="number"
              min="0"
              max="24"
              value={localFilters.maxHours}
              onChange={(e) => setLocalFilters({ ...localFilters, maxHours: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} className="flex-1">
          Aplikovat filtry
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Resetovat
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Zrušit
        </Button>
      </div>
    </div>
  );
};

export default ShiftFilters;
