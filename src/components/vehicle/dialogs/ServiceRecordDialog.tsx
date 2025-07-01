
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRecord } from '@/types/vehicle';
import { useTranslation } from 'react-i18next';

interface ServiceRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
  record?: ServiceRecord | null;
}

const ServiceRecordDialog: React.FC<ServiceRecordDialogProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onSuccess,
  record = null
}) => {
  const { t } = useTranslation(['vehicle']);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_date: new Date().toISOString().split('T')[0],
    service_type: '',
    description: '',
    cost: '',
    provider: '',
    mileage: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        service_date: record.service_date,
        service_type: record.service_type,
        description: record.description || '',
        cost: record.cost.toString(),
        provider: record.provider,
        mileage: record.mileage
      });
    } else {
      setFormData({
        service_date: new Date().toISOString().split('T')[0],
        service_type: '',
        description: '',
        cost: '',
        provider: '',
        mileage: ''
      });
    }
  }, [record, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Service record saved successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving service record:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {record ? t('vehicle:editServiceRecord') : t('vehicle:addServiceRecord')}
          </DialogTitle>
          <DialogDescription>
            {record ? t('vehicle:editServiceRecordDescription') : t('vehicle:addServiceRecordDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_date">{t('vehicle:date')} *</Label>
              <Input
                id="service_date"
                type="date"
                value={formData.service_date}
                onChange={(e) => handleInputChange('service_date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">{t('vehicle:mileage')} *</Label>
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
            <Label htmlFor="service_type">{t('vehicle:serviceType')} *</Label>
            <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicle:selectServiceType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regularMaintenance">Pravidelná údržba</SelectItem>
                <SelectItem value="repair">Oprava</SelectItem>
                <SelectItem value="inspection">Kontrola</SelectItem>
                <SelectItem value="warranty">Záruka</SelectItem>
                <SelectItem value="other">Ostatní</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider">{t('vehicle:provider')} *</Label>
            <Input
              id="provider"
              type="text"
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              placeholder="AutoService, Bosch..."
              required
            />
          </div>

          <div>
            <Label htmlFor="cost">{t('vehicle:cost')} (Kč) *</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t('vehicle:description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('vehicle:serviceDescription')}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('vehicle:cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('vehicle:saving') : (record ? t('vehicle:save') : t('vehicle:add'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRecordDialog;
