
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building, Euro, Download, MapPin, Calendar } from 'lucide-react';
import { EmploymentInfo } from '../types';
import { useShiftsData } from '../hooks/useShiftsData';

interface EmploymentStepProps {
  data: EmploymentInfo;
  onChange: (data: EmploymentInfo) => void;
}

const EmploymentStep: React.FC<EmploymentStepProps> = ({ data, onChange }) => {
  const shiftsData = useShiftsData();

  const handleChange = (field: keyof EmploymentInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleImportFromShifts = (checked: boolean | "indeterminate") => {
    const importShifts = checked === true;
    onChange({
      ...data,
      importFromShifts: importShifts,
      ...(importShifts && shiftsData.hasCommuteData ? {
        commuteDistance: shiftsData.averageCommuteDistance,
        workDaysPerYear: shiftsData.totalWorkDays
      } : {})
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Údaje o zaměstnání
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employerName">Název zaměstnavatele</Label>
          <Input
            id="employerName"
            placeholder="Název firmy"
            value={data.employerName}
            onChange={(e) => handleChange('employerName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualIncome" className="flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Roční hrubý příjem (€)
            </Label>
            <Input
              id="annualIncome"
              type="number"
              placeholder="např. 45000"
              value={data.annualIncome || ''}
              onChange={(e) => handleChange('annualIncome', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxClass">Daňová třída v Německu</Label>
            <Select value={data.taxClass} onValueChange={(value) => handleChange('taxClass', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte třídu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Třída I - Svobodní</SelectItem>
                <SelectItem value="2">Třída II - Samoživitelé</SelectItem>
                <SelectItem value="3">Třída III - Manželé (vyšší příjem)</SelectItem>
                <SelectItem value="4">Třída IV - Manželé (podobný příjem)</SelectItem>
                <SelectItem value="5">Třída V - Manželé (nižší příjem)</SelectItem>
                <SelectItem value="6">Třída VI - Vedlejší příjem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {shiftsData.hasCommuteData && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="importFromShifts"
                checked={data.importFromShifts}
                onCheckedChange={handleImportFromShifts}
              />
              <Label htmlFor="importFromShifts" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Importovat data ze směn
              </Label>
              <Badge variant="outline">Doporučeno</Badge>
            </div>
            
            {shiftsData.hasCommuteData && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Průměrná vzdálenost: {shiftsData.averageCommuteDistance} km
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Počet pracovních dní: {shiftsData.totalWorkDays}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commuteDistance">Vzdálenost do práce (km)</Label>
            <Input
              id="commuteDistance"
              type="number"
              placeholder="např. 35"
              value={data.commuteDistance || ''}
              onChange={(e) => handleChange('commuteDistance', parseFloat(e.target.value) || 0)}
              disabled={data.importFromShifts && shiftsData.hasCommuteData}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workDaysPerYear">Počet pracovních dní ročně</Label>
            <Input
              id="workDaysPerYear"
              type="number"
              placeholder="220"
              value={data.workDaysPerYear || ''}
              onChange={(e) => handleChange('workDaysPerYear', parseInt(e.target.value) || 220)}
              disabled={data.importFromShifts && shiftsData.hasCommuteData}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmploymentStep;
