
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import CrossBorderTaxCalculator from "./CrossBorderTaxCalculator";
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

const BasicCalculator = () => {
  const [num1, setNum1] = useState<string>('0');
  const [num2, setNum2] = useState<string>('0');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<number | string>(0);
  const { toast } = useToast();
  const { t } = useLanguage();

  const calculateResult = () => {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
    if (isNaN(number1) || isNaN(number2)) {
      toast({
        title: t('error') || "Chyba",
        description: t('invalidInput') || "Zadejte platná čísla",
        variant: "destructive"
      });
      return;
    }
    
    let calculatedResult: number | string;
    
    switch (operation) {
      case 'add':
        calculatedResult = number1 + number2;
        break;
      case 'subtract':
        calculatedResult = number1 - number2;
        break;
      case 'multiply':
        calculatedResult = number1 * number2;
        break;
      case 'divide':
        if (number2 === 0) {
          toast({
            title: t('error') || "Chyba",
            description: t('divisionByZero') || "Nelze dělit nulou",
            variant: "destructive"
          });
          calculatedResult = t('divisionByZeroError') || "Chyba: Dělení nulou";
        } else {
          calculatedResult = number1 / number2;
        }
        break;
      default:
        calculatedResult = 0;
    }
    
    setResult(calculatedResult);
    
    if (typeof calculatedResult === 'number') {
      toast({
        title: t('calculationComplete') || "Výpočet dokončen",
        description: `${t('result') || 'Výsledek'}: ${calculatedResult}`,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      <DashboardCard
        title={t('basicCalculator') || "Základní kalkulačka"}
        description={t('basicCalculatorDescription') || "Jednoduchá kalkulačka pro základní matematické operace"}
        index={0}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="num1">{t('firstNumber') || 'První číslo'}</Label>
            <Input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="text-base h-10"
              placeholder={t('enterFirstNumber') || "Zadejte první číslo"}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operation">{t('operation') || 'Operace'}</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger id="operation" className="h-10">
                <SelectValue placeholder={t('selectOperation') || "Vyberte operaci"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">{t('addition') || 'Sčítání'} (+)</SelectItem>
                <SelectItem value="subtract">{t('subtraction') || 'Odčítání'} (-)</SelectItem>
                <SelectItem value="multiply">{t('multiplication') || 'Násobení'} (×)</SelectItem>
                <SelectItem value="divide">{t('division') || 'Dělení'} (÷)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="num2">{t('secondNumber') || 'Druhé číslo'}</Label>
            <Input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="text-base h-10"
              placeholder={t('enterSecondNumber') || "Zadejte druhé číslo"}
            />
          </div>
          
          <Button 
            onClick={calculateResult} 
            className="w-full h-10 bg-primary hover:bg-primary/90 transition-colors"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {t('calculate') || 'Vypočítat'}
          </Button>
          
          <div className="p-4 bg-muted rounded-md text-center mt-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {t('result') || 'Výsledek'}:
            </div>
            <div className="text-3xl font-bold break-all">
              {result}
            </div>
          </div>
        </div>
      </DashboardCard>
      
      <DashboardCard
        title={t('crossBorderTax') || "Daňová kalkulačka pro pendlery"}
        description={t('crossBorderTaxDescription') || "Speciální výpočty pro hraniční práci"}
        index={1}
      >
        <CrossBorderTaxCalculator />
      </DashboardCard>
    </div>
  );
};

export default BasicCalculator;
