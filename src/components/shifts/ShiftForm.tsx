
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ShiftFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ShiftForm = ({ onSubmit, onCancel, initialData }: ShiftFormProps) => {
  const [formData, setFormData] = useState({
    date: initialData?.date || '',
    type: initialData?.type || 'morning',
    hours: initialData?.hours || 8,
    location: initialData?.location || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Datum</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Typ směny</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Ranní směna</SelectItem>
            <SelectItem value="afternoon">Odpolední směna</SelectItem>
            <SelectItem value="night">Noční směna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="hours">Počet hodin</Label>
        <Input
          id="hours"
          type="number"
          min="1"
          max="24"
          value={formData.hours}
          onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="location">Místo</Label>
        <Input
          id="location"
          placeholder="Místo výkonu práce"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="notes">Poznámky</Label>
        <Textarea
          id="notes"
          placeholder="Volitelné poznámky..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {initialData ? 'Aktualizovat' : 'Přidat směnu'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Zrušit
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
