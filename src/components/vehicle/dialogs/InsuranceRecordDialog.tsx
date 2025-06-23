
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InsuranceRecord } from '@/types/vehicle';
import { saveInsuranceRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useTranslation } from 'react-i18next';

interface InsuranceRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
  record?: InsuranceRecord | null;
}

const InsuranceRecordDialog: React.FC<InsuranceRecordDialogProps> = ({
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
    provider: '',
    insurance_type: '',
    policy_number: '',
    start_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    cost: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        provider: record.provider,
        insurance_type: record.insurance_type,
        policy_number: record.policy_number,
        start_date: record.start_date,
        expiry_date: record.expiry_date,
        cost: record.cost.toString()
      });
    } else {
      setFormData({
        provider: '',
        insurance_type: '',
        policy_number: '',
        start_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        cost: ''
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
      const recordData: Partial<InsuranceRecord> = {
        vehicle_id: vehicleId,
        provider: formData.provider,
        insurance_type: formData.insurance_type,
        policy_number: formData.policy_number,
        start_date: formData.start_date,
        expiry_date: formData.expiry_date,
        cost: parseFloat(formData.cost)
      };

      if (record) {
        recordData.id = record.id;
      }

      await saveInsuranceRecord(recordData);
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
            {record ? t('vehicle:edit') : t('vehicle:add')} {t('vehicle:insurance')}
          </DialogTitle>
          <DialogDescription>
            {t('vehicle:insuranceInfo')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="provider">{t('vehicle:insuranceProvider')} *</Label>
            <Input
              id="provider"
              type="text"
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              placeholder="Allianz, ČSOB..."
              required
            />
          </div>

          <div>
            <Label htmlFor="insurance_type">{t('vehicle:insuranceType')} *</Label>
            <Select value={formData.insurance_type} onValueChange={(value) => handleInputChange('insurance_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicle:selectServiceType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="liability">{t('vehicle:insurance')}</SelectItem>
                <SelectItem value="comprehensive">{t('vehicle:insurance')}</SelectItem>
                <SelectItem value="collision">{t('vehicle:insurance')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="policy_number">{t('vehicle:policyNumber')} *</Label>
            <Input
              id="policy_number"
              type="text"
              value={formData.policy_number}
              onChange={(e) => handleInputChange('policy_number', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">{t('vehicle:date')} *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="expiry_date">{t('vehicle:insuranceExpiry')} *</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                required
              />
            </div>
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

export default InsuranceRecordDialog;
