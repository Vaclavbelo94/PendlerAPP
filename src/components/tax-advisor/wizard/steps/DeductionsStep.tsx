
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shirt, GraduationCap, Shield, Church, BookOpen, Wrench, Package, Users, Home } from 'lucide-react';
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

        {/* Odborná literatura */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="professionalLiterature"
              checked={data.professionalLiterature}
              onCheckedChange={(checked) => handleChange('professionalLiterature', checked === true)}
            />
            <Label htmlFor="professionalLiterature" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Odborná literatura
            </Label>
          </div>
          
          {data.professionalLiterature && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="professionalLiteratureCost">Náklady na odbornou literaturu (€/rok)</Label>
              <Input
                id="professionalLiteratureCost"
                type="number"
                value={data.professionalLiteratureCost || ''}
                onChange={(e) => handleChange('professionalLiteratureCost', parseFloat(e.target.value) || 0)}
                placeholder="200"
              />
            </div>
          )}
        </div>

        {/* Pracovní nástroje */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tools"
              checked={data.tools}
              onCheckedChange={(checked) => handleChange('tools', checked === true)}
            />
            <Label htmlFor="tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Pracovní nástroje
            </Label>
          </div>
          
          {data.tools && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="toolsCost">Náklady na pracovní nástroje (€/rok)</Label>
              <Input
                id="toolsCost"
                type="number"
                value={data.toolsCost || ''}
                onChange={(e) => handleChange('toolsCost', parseFloat(e.target.value) || 0)}
                placeholder="500"
              />
            </div>
          )}
        </div>

        {/* Pracovní materiál */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="workingMaterials"
              checked={data.workingMaterials}
              onCheckedChange={(checked) => handleChange('workingMaterials', checked === true)}
            />
            <Label htmlFor="workingMaterials" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pracovní materiál
            </Label>
          </div>
          
          {data.workingMaterials && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="workingMaterialsCost">Náklady na pracovní materiál (€/rok)</Label>
              <Input
                id="workingMaterialsCost"
                type="number"
                value={data.workingMaterialsCost || ''}
                onChange={(e) => handleChange('workingMaterialsCost', parseFloat(e.target.value) || 0)}
                placeholder="300"
              />
            </div>
          )}
        </div>

        {/* Profesní sdružení */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="professionalAssociation"
              checked={data.professionalAssociation}
              onCheckedChange={(checked) => handleChange('professionalAssociation', checked === true)}
            />
            <Label htmlFor="professionalAssociation" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Členství v profesním sdružení
            </Label>
          </div>
          
          {data.professionalAssociation && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="professionalAssociationCost">Náklady na členství (€/rok)</Label>
              <Input
                id="professionalAssociationCost"
                type="number"
                value={data.professionalAssociationCost || ''}
                onChange={(e) => handleChange('professionalAssociationCost', parseFloat(e.target.value) || 0)}
                placeholder="150"
              />
            </div>
          )}
        </div>

        {/* Home Office */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="homeOffice"
              checked={data.homeOffice}
              onCheckedChange={(checked) => handleChange('homeOffice', checked === true)}
            />
            <Label htmlFor="homeOffice" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home Office paušál
            </Label>
          </div>
          
          {data.homeOffice && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="homeOfficeCost">Home Office náklady (€/rok)</Label>
              <Input
                id="homeOfficeCost"
                type="number"
                value={data.homeOfficeCost || ''}
                onChange={(e) => handleChange('homeOfficeCost', parseFloat(e.target.value) || 0)}
                placeholder="1260"
              />
              <p className="text-sm text-muted-foreground">
                Standardní sazba: 5€/den × 252 pracovních dnů = 1.260€/rok
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductionsStep;
