
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRecord } from '@/types/vehicle';
import { saveServiceRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
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
  const { success, error } = useStandardizedToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    service_type: '',
    description: '',
    cost: '',
    provider: '',
    mileage: '',
    next_service_date: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        date: record.date,
        service_type: record.service_type,
        description: record.description || '',
        cost: record.cost.toString(),
        provider: record.provider,
        mileage: record.mileage,
        next_service_date: record.next_service_date || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        service_type: '',
        description: '',
        cost: '',
        provider: '',
        mileage: '',
        next_service_date: ''
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
      const recordData: Partial<ServiceRecord> = {
        vehicle_id: vehicleId,
        date: formData.date,
        service_type: formData.service_type,
        description: formData.description,
        cost: parseFloat(formData.cost),
        provider: formData.provider,
        mileage: formData.mileage,
        next_service_date: formData.next_service_date || null
      };

      if (record) {
        recordData.id = record.id;
      }

      await saveServiceRecord(recordData);
      success(record ? t('vehicle:serviceRecordUpdated') : t('vehicle:serviceRecordSaved'));
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || t('vehicle:errorSavingServiceRecord'));
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
            {record ? t('vehicle:editServiceRecord') : t('vehicle:addServiceRecord')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">{t('vehicle:date')} *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
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
                <SelectItem value="regularMaintenance">{t('vehicle:serviceTypes.regularMaintenance')}</SelectItem>
                <SelectItem value="repair">{t('vehicle:serviceTypes.repair')}</SelectItem>
                <SelectItem value="inspection">{t('vehicle:serviceTypes.inspection')}</SelectItem>
                <SelectItem value="warranty">{t('vehicle:serviceTypes.warranty')}</SelectItem>
                <SelectItem value="other">{t('vehicle:serviceTypes.other')}</SelectItem>
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

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="next_service_date">{t('vehicle:nextServiceDue')}</Label>
              <Input
                id="next_service_date"
                type="date"
                value={formData.next_service_date}
                onChange={(e) => handleInputChange('next_service_date', e.target.value)}
              />
            </div>
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
