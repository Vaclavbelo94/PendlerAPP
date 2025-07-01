
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShiftFormData, ShiftType } from '@/types/shifts';
import { useTranslation } from 'react-i18next';

interface UnifiedShiftFormProps {
  onSubmit: (data: ShiftFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: ShiftFormData;
  selectedDate?: Date;
  submitLabel?: string;
}

const UnifiedShiftForm: React.FC<UnifiedShiftFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  selectedDate,
  submitLabel
}) => {
  const { t } = useTranslation('shifts');
  const [formData, setFormData] = useState<ShiftFormData>({
    type: 'morning',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const shiftTypes: { value: ShiftType; label: string }[] = [
    { value: 'morning', label: 'Ranní směna' },
    { value: 'afternoon', label: 'Odpolední směna' },
    { value: 'night', label: 'Noční směna' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedDate && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Datum: {selectedDate.toLocaleDateString('cs-CZ')}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="shiftType">Typ směny *</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: ShiftType) => setFormData(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyberte typ směny" />
          </SelectTrigger>
          <SelectContent>
            {shiftTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${
                    type.value === 'morning' ? 'bg-blue-500' :
                    type.value === 'afternoon' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}></div>
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Poznámky</Label>
        <Textarea
          id="notes"
          placeholder="Volitelná poznámka ke směně"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Zrušit
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Ukládám...' : (submitLabel || 'Uložit směnu')}
        </Button>
      </div>
    </form>
  );
};

export default UnifiedShiftForm;
