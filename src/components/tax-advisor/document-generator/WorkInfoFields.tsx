
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkInfoFieldsProps {
  employerName?: string;
  incomeAmount?: string;
  includeCommuteExpenses: boolean;
  commuteDistance?: string;
  commuteWorkDays?: string;
  includeSecondHome: boolean;
  includeWorkClothes: boolean;
  additionalNotes?: string;
  onUpdateField: (field: string, value: string | boolean) => void;
}

const WorkInfoFields: React.FC<WorkInfoFieldsProps> = ({
  employerName,
  incomeAmount,
  includeCommuteExpenses,
  commuteDistance,
  commuteWorkDays,
  includeSecondHome,
  includeWorkClothes,
  additionalNotes,
  onUpdateField,
}) => {
  return (
    <div className="space-y-5 pt-2 md:pt-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Pracovní informace</h3>
        <p className="text-sm text-muted-foreground">
          Doplňte údaje o vaší práci a odpočitatelných položkách
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employer-name">Název zaměstnavatele</Label>
          <Input
            id="employer-name"
            placeholder="Název firmy GmbH"
            value={employerName}
            onChange={(e) => onUpdateField("employerName", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="income-amount">Roční příjem (€)</Label>
          <Input
            id="income-amount"
            type="number"
            placeholder="60000"
            value={incomeAmount}
            onChange={(e) => onUpdateField("incomeAmount", e.target.value)}
          />
        </div>
        
        <div className="space-y-4 pt-2">
          <Label>Odpočitatelné položky</Label>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="commute-expenses"
              checked={includeCommuteExpenses}
              onCheckedChange={(checked) => 
                onUpdateField("includeCommuteExpenses", checked === true)}
            />
            <Label 
              htmlFor="commute-expenses"
              className="text-sm font-normal"
            >
              Náklady na dojíždění (Entfernungspauschale)
            </Label>
          </div>
          
          {includeCommuteExpenses && (
            <div className="ml-6 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="commute-distance">Vzdálenost jedním směrem (km)</Label>
                <Input
                  id="commute-distance"
                  type="number"
                  placeholder="25"
                  value={commuteDistance}
                  onChange={(e) => onUpdateField("commuteDistance", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commute-work-days">Počet pracovních dní v roce</Label>
                <Input
                  id="commute-work-days"
                  type="number"
                  placeholder="220"
                  value={commuteWorkDays}
                  onChange={(e) => onUpdateField("commuteWorkDays", e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="second-home" 
              checked={includeSecondHome}
              onCheckedChange={(checked) => 
                onUpdateField("includeSecondHome", checked === true)}
            />
            <Label 
              htmlFor="second-home"
              className="text-sm font-normal"
            >
              Druhé bydlení v Německu
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="work-clothes" 
              checked={includeWorkClothes}
              onCheckedChange={(checked) => 
                onUpdateField("includeWorkClothes", checked === true)}
            />
            <Label 
              htmlFor="work-clothes"
              className="text-sm font-normal"
            >
              Pracovní oděvy a pomůcky
            </Label>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <Label htmlFor="additional-notes">Další poznámky</Label>
          <Textarea
            id="additional-notes"
            placeholder="Doplňující informace k dokumentu..."
            value={additionalNotes}
            onChange={(e) => onUpdateField("additionalNotes", e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkInfoFields;
