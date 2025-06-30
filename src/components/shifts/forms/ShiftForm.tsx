
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShiftFormData, ShiftType } from '@/types/shifts';
import { useTranslation } from 'react-i18next';

interface ShiftFormProps {
  onSubmit: (data: ShiftFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: ShiftFormData;
  selectedDate?: Date;
  submitLabel?: string;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
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
    { value: 'morning', label: t('types.morning') },
    { value: 'afternoon', label: t('types.afternoon') },
    { value: 'night', label: t('types.night') }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {selectedDate && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t('selectDate')}: {selectedDate.toLocaleDateString('cs-CZ')}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="shiftType">{t('shiftType')} *</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: ShiftType) => setFormData(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('selectShiftType')} />
          </SelectTrigger>
          <SelectContent>
            {shiftTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          placeholder={t('optionalShiftNote')}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('saving') : (submitLabel || t('saveShift'))}
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
