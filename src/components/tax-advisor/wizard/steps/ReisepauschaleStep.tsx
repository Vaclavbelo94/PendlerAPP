
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Car, Home, Euro, Calculator } from 'lucide-react';
import { ReisepauschaleInfo, EmploymentInfo } from '../types';
import { useTranslation } from 'react-i18next';

interface ReisepauschaleStepProps {
  data: ReisepauschaleInfo;
  employmentData: EmploymentInfo;
  onChange: (data: ReisepauschaleInfo) => void;
}

const ReisepauschaleStep: React.FC<ReisepauschaleStepProps> = ({ 
  data, 
  employmentData, 
  onChange 
}) => {
  const { t } = useTranslation('taxAdvisor');

  // Synchronizace dat ze zaměstnání
  useEffect(() => {
    if (employmentData.commuteDistance !== data.commuteDistance || 
        employmentData.workDaysPerYear !== data.workDaysPerYear) {
      onChange({
        ...data,
        commuteDistance: employmentData.commuteDistance,
        workDaysPerYear: employmentData.workDaysPerYear
      });
    }
  }, [employmentData.commuteDistance, employmentData.workDaysPerYear]);

  const handleChange = (field: keyof ReisepauschaleInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSecondHomeChange = (checked: boolean | "indeterminate") => {
    handleChange('hasSecondHome', checked === true);
  };

  // Výpočet cestovních náhrad
  const calculateReisepauschale = () => {
    if (!data.commuteDistance || !data.workDaysPerYear) return 0;
    
    if (data.transportType === 'car') {
      if (data.commuteDistance <= 20) {
        return data.commuteDistance * 0.30 * data.workDaysPerYear;
      } else {
        return (20 * 0.30 + (data.commuteDistance - 20) * 0.38) * data.workDaysPerYear;
      }
    } else {
      return data.commuteDistance * 0.30 * data.workDaysPerYear;
    }
  };

  const reisepausaleBenefit = calculateReisepauschale();
  const secondHomeBenefit = data.hasSecondHome ? data.secondHomeCost : 0;
  const totalBenefit = reisepausaleBenefit + secondHomeBenefit;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          {t('wizard.reisepauschale.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t('wizard.reisepauschale.commuteDistance')}:</span>
              <span className="font-medium ml-2">{data.commuteDistance} km</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('wizard.reisepauschale.workDaysPerYear')}:</span>
              <span className="font-medium ml-2">{data.workDaysPerYear}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transportType">{t('wizard.reisepauschale.transportType')}</Label>
          <Select value={data.transportType} onValueChange={(value: 'car' | 'public') => handleChange('transportType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">
                {t('wizard.reisepauschale.car')} (0.30€ {t('wizard.reisepauschale.perKm')} ≤20km, 0.38€ {t('wizard.reisepauschale.perKm')} >20km)
              </SelectItem>
              <SelectItem value="public">
                {t('wizard.reisepauschale.publicTransport')} (0.30€{t('wizard.reisepauschale.perKm')})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="secondHome"
              checked={data.hasSecondHome}
              onCheckedChange={handleSecondHomeChange}
            />
            <Label htmlFor="secondHome" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              {t('wizard.reisepauschale.hasSecondHome')}
            </Label>
          </div>

          {data.hasSecondHome && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="secondHomeCost">{t('wizard.reisepauschale.secondHomeCost')}</Label>
              <Input
                id="secondHomeCost"
                type="number"
                value={data.secondHomeCost || ''}
                onChange={(e) => handleChange('secondHomeCost', parseFloat(e.target.value) || 0)}
                placeholder="1200"
              />
            </div>
          )}
        </div>

        {/* Výsledky výpočtu */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {t('wizard.reisepauschale.calculation')}
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('wizard.reisepauschale.title')}:</span>
              <span className="font-medium">{reisepausaleBenefit.toFixed(2)} €</span>
            </div>
            
            {data.hasSecondHome && (
              <div className="flex justify-between">
                <span>{t('wizard.reisepauschale.hasSecondHome')}:</span>
                <span className="font-medium">{secondHomeBenefit.toFixed(2)} €</span>
              </div>
            )}
            
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>{t('wizard.results.totalDeductions')}:</span>
              <span className="text-green-600">{totalBenefit.toFixed(2)} €</span>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <span>{t('wizard.results.estimatedSaving')} (25%):</span>
              <span>{(totalBenefit * 0.25).toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReisepauschaleStep;
