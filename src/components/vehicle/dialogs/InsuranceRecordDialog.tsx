
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InsuranceRecord } from '@/types/vehicle';
import { saveInsuranceRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

interface InsuranceRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

const InsuranceRecordDialog: React.FC<InsuranceRecordDialogProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useStandardizedToast();
  const [formData, setFormData] = useState({
    provider: '',
    policy_number: '',
    valid_from: '',
    valid_until: '',
    monthly_cost: '',
    coverage_type: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const record: Partial<InsuranceRecord> = {
        vehicle_id: vehicleId,
        provider: formData.provider,
        policy_number: formData.policy_number,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until,
        monthly_cost: formData.monthly_cost,
        coverage_type: formData.coverage_type,
        notes: formData.notes
      };

      await saveInsuranceRecord(record);
      success('Záznam o pojištění byl úspěšně přidán');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || 'Chyba při ukládání záznamu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Přidat pojištění</DialogTitle>
          <DialogDescription>
            Zadejte údaje o pojištění vozidla
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="provider">Pojišťovna *</Label>
            <Input
              id="provider"
              type="text"
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              placeholder="Allianz, Kooperativa..."
              required
            />
          </div>

          <div>
            <Label htmlFor="policy_number">Číslo pojistky *</Label>
            <Input
              id="policy_number"
              type="text"
              value={formData.policy_number}
              onChange={(e) => handleInputChange('policy_number', e.target.value)}
              placeholder="123456789"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_from">Platné od *</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => handleInputChange('valid_from', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="valid_until">Platné do *</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => handleInputChange('valid_until', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_cost">Měsíční platba (Kč) *</Label>
              <Input
                id="monthly_cost"
                type="text"
                value={formData.monthly_cost}
                onChange={(e) => handleInputChange('monthly_cost', e.target.value)}
                placeholder="2500"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="coverage_type">Typ pojištění *</Label>
              <Select value={formData.coverage_type} onValueChange={(value) => handleInputChange('coverage_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="povinne">Povinné ručení</SelectItem>
                  <SelectItem value="havarijni">Havarijní pojištění</SelectItem>
                  <SelectItem value="komplexni">Komplexní pojištění</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Dodatečné informace..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ukládám...' : 'Přidat'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InsuranceRecordDialog;
