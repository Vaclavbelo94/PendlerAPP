
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shirt, GraduationCap, Shield, Church, Calculator } from 'lucide-react';
import { AdditionalDeductions } from '../types';

interface DeductionsStepProps {
  data: AdditionalDeductions;
  onChange: (data: AdditionalDeductions) => void;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof AdditionalDeductions, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleCheckboxChange = (field: keyof AdditionalDeductions) => (checked: boolean | "indeterminate") => {
    handleChange(field, checked === true);
  };

  const calculateTotalDeductions = () => {
    let total = 0;
    if (data.workClothes) total += data.workClothesCost;
    if (data.education) total += data.educationCost;
    if (data.insurance) total += data.insuranceCost;
    return total;
  };

  const totalDeductions = calculateTotalDeductions();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Další odpočitatelné položky
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pracovní oblečení */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="workClothes"
              checked={data.workClothes}
              onCheckedChange={handleCheckboxChange('workClothes')}
            />
            <Label htmlFor="workClothes" className="flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Pracovní oblečení a pomůcky
            </Label>
            <Badge variant="outline">Běžné</Badge>
          </div>
          
          {data.workClothes && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="workClothesCost">Roční náklad (€)</Label>
              <Input
                id="workClothesCost"
                type="number"
                value={data.workClothesCost || ''}
                onChange={(e) => handleChange('workClothesCost', parseFloat(e.target.value) || 0)}
                placeholder="např. 400"
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
              onCheckedChange={handleCheckboxChange('education')}
            />
            <Label htmlFor="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Fortbildung (profesní vzdělávání)
            </Label>
            <Badge variant="outline">Výhodné</Badge>
          </div>
          
          {data.education && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="educationCost">Roční náklad (€)</Label>
              <Input
                id="educationCost"
                type="number"
                value={data.educationCost || ''}
                onChange={(e) => handleChange('educationCost', parseFloat(e.target.value) || 0)}
                placeholder="např. 800"
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
              onCheckedChange={handleCheckboxChange('insurance')}
            />
            <Label htmlFor="insurance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Dodatečné pojištění
            </Label>
          </div>
          
          {data.insurance && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="insuranceCost">Roční náklad (€)</Label>
              <Input
                id="insuranceCost"
                type="number"
                value={data.insuranceCost || ''}
                onChange={(e) => handleChange('insuranceCost', parseFloat(e.target.value) || 0)}
                placeholder="např. 300"
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
              onCheckedChange={handleCheckboxChange('churchTax')}
            />
            <Label htmlFor="churchTax" className="flex items-center gap-2">
              <Church className="h-4 w-4" />
              Platím církevní daň (Kirchensteuer)
            </Label>
          </div>
        </div>

        {/* Souhrn dalších odpočtů */}
        {totalDeductions > 0 && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Souhrn dalších odpočtů</h4>
            <div className="space-y-2 text-sm">
              {data.workClothes && (
                <div className="flex justify-between">
                  <span>Pracovní oblečení:</span>
                  <span className="font-medium">{data.workClothesCost.toFixed(2)} €</span>
                </div>
              )}
              {data.education && (
                <div className="flex justify-between">
                  <span>Vzdělávání:</span>
                  <span className="font-medium">{data.educationCost.toFixed(2)} €</span>
                </div>
              )}
              {data.insurance && (
                <div className="flex justify-between">
                  <span>Pojištění:</span>
                  <span className="font-medium">{data.insuranceCost.toFixed(2)} €</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Celkem další odpočty:</span>
                <span className="text-green-600">{totalDeductions.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeductionsStep;
