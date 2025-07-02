
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
import { useCurrencyFormatter } from '@/utils/currencyUtils';

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
  const { getCurrencySymbol } = useCurrencyFormatter();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useStandardizedToast();
  const [formData, setFormData] = useState({
    provider: '',
    coverage_type: '',
    policy_number: '',
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '',
    monthly_cost: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        provider: record.provider,
        coverage_type: record.coverage_type,
        policy_number: record.policy_number,
        valid_from: record.valid_from,
        valid_until: record.valid_until,
        monthly_cost: record.monthly_cost.toString()
      });
    } else {
      setFormData({
        provider: '',
        coverage_type: '',
        policy_number: '',
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '',
        monthly_cost: ''
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
        coverage_type: formData.coverage_type,
        policy_number: formData.policy_number,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until,
        monthly_cost: formData.monthly_cost
      };

      if (record) {
        recordData.id = record.id;
      }

      await saveInsuranceRecord(recordData);
      success(record ? t('vehicle:insuranceRecordUpdated') : t('vehicle:insuranceRecordSaved'));
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.message || t('vehicle:errorSavingInsuranceRecord'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {record ? t('vehicle:editInsuranceRecord') : t('vehicle:addInsuranceRecord')}
          </DialogTitle>
          <DialogDescription>
            {t('vehicle:insuranceRecordInfo')}
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
            <Label htmlFor="coverage_type">{t('vehicle:coverageType')} *</Label>
            <Select value={formData.coverage_type} onValueChange={(value) => handleInputChange('coverage_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('vehicle:selectCoverageType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="liability">{t('vehicle:liability')}</SelectItem>
                <SelectItem value="comprehensive">{t('vehicle:comprehensive')}</SelectItem>
                <SelectItem value="collision">{t('vehicle:collision')}</SelectItem>
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
              <Label htmlFor="valid_from">{t('vehicle:validFrom')} *</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => handleInputChange('valid_from', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="valid_until">{t('vehicle:validUntil')} *</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => handleInputChange('valid_until', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="monthly_cost">{t('vehicle:monthlyCost')} ({getCurrencySymbol()}) *</Label>
            <Input
              id="monthly_cost"
              type="number"
              step="0.01"
              value={formData.monthly_cost}
              onChange={(e) => handleInputChange('monthly_cost', e.target.value)}
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
