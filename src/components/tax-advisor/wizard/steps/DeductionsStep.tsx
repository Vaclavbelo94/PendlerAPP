
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shirt, GraduationCap, Shield, Church } from 'lucide-react';
import { AdditionalDeductions } from '../types';
import { useTranslation } from 'react-i18next';

interface DeductionsStepProps {
  data: AdditionalDeductions;
  onChange: (data: AdditionalDeductions) => void;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({ data, onChange }) => {
  const { t } = useTranslation('taxAdvisor');

  const handleChange = (field: keyof AdditionalDeductions, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('wizard.deductions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pracovní oblečení */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="workClothes"
              checked={data.workClothes}
              onCheckedChange={(checked) => handleChange('workClothes', checked === true)}
            />
            <Label htmlFor="workClothes" className="flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              {t('wizard.deductions.workClothes')}
            </Label>
          </div>
          
          {data.workClothes && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="workClothesCost">{t('wizard.deductions.workClothesCost')}</Label>
              <Input
                id="workClothesCost"
                type="number"
                value={data.workClothesCost || ''}
                onChange={(e) => handleChange('workClothesCost', parseFloat(e.target.value) || 0)}
                placeholder="400"
              />
            </div>
          )}
        </div>

        {/* Vzdělávání */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="education"
              checked={data.education}
              onCheckedChange={(checked) => handleChange('education', checked === true)}
            />
            <Label htmlFor="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {t('wizard.deductions.education')}
            </Label>
          </div>
          
          {data.education && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="educationCost">{t('wizard.deductions.educationCost')}</Label>
              <Input
                id="educationCost"
                type="number"
                value={data.educationCost || ''}
                onChange={(e) => handleChange('educationCost', parseFloat(e.target.value) || 0)}
                placeholder="800"
              />
            </div>
          )}
        </div>

        {/* Pojištění */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="insurance"
              checked={data.insurance}
              onCheckedChange={(checked) => handleChange('insurance', checked === true)}
            />
            <Label htmlFor="insurance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('wizard.deductions.insurance')}
            </Label>
          </div>
          
          {data.insurance && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="insuranceCost">{t('wizard.deductions.insuranceCost')}</Label>
              <Input
                id="insuranceCost"
                type="number"
                value={data.insuranceCost || ''}
                onChange={(e) => handleChange('insuranceCost', parseFloat(e.target.value) || 0)}
                placeholder="300"
              />
            </div>
          )}
        </div>

        {/* Církevní daň */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="churchTax"
              checked={data.churchTax}
              onCheckedChange={(checked) => handleChange('churchTax', checked === true)}
            />
            <Label htmlFor="churchTax" className="flex items-center gap-2">
              <Church className="h-4 w-4" />
              {t('wizard.deductions.churchTax')}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductionsStep;
