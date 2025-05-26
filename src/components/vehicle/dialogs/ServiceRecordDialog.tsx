
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRecord } from '@/types/vehicle';
import { saveServiceRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

interface ServiceRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

const ServiceRecordDialog: React.FC<ServiceRecordDialogProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useStandardizedToast();
  const [formData, setFormData] = useState({
    service_date: new Date().toISOString().split('T')[0],
    service_type: '',
    description: '',
    mileage: '',
    cost: '',
    provider: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const record: Partial<ServiceRecord> = {
        vehicle_id: vehicleId,
        service_date: formData.service_date,
        service_type: formData.service_type,
        description: formData.description,
        mileage: formData.mileage,
        cost: formData.cost,
        provider: formData.provider
      };

      await saveServiceRecord(record);
      success('Záznam o servisu byl úspěšně přidán');
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
          <DialogTitle>Přidat servisní záznam</DialogTitle>
          <DialogDescription>
            Zadejte údaje o servisu vozidla
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_date">Datum servisu *</Label>
              <Input
                id="service_date"
                type="date"
                value={formData.service_date}
                onChange={(e) => handleInputChange('service_date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">Stav km *</Label>
              <Input
                id="mileage"
                type="text"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
                placeholder="145000"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="service_type">Typ servisu *</Label>
            <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte typ servisu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pravidelna_udrzba">Pravidelná údržba</SelectItem>
                <SelectItem value="oprava">Oprava</SelectItem>
                <SelectItem value="vymena_oleje">Výměna oleje</SelectItem>
                <SelectItem value="vymena_brzd">Výměna brzd</SelectItem>
                <SelectItem value="vymena_pneumatik">Výměna pneumatik</SelectItem>
                <SelectItem value="technicka_kontrola">Technická kontrola</SelectItem>
                <SelectItem value="jine">Jiné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Popis práce *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Výměna oleje a filtru..."
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Cena (Kč) *</Label>
              <Input
                id="cost"
                type="text"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                placeholder="2500"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="provider">Servis *</Label>
              <Input
                id="provider"
                type="text"
                value={formData.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                placeholder="AutoServis XYZ"
                required
              />
            </div>
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

export default ServiceRecordDialog;
