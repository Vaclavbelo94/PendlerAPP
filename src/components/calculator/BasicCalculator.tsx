
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { useState } from "react";
import CrossBorderTaxCalculator from "./CrossBorderTaxCalculator";
import { useToast } from '@/components/ui/use-toast';

const BasicCalculator = () => {
  const [num1, setNum1] = useState<string>('0');
  const [num2, setNum2] = useState<string>('0');
  const [operation, setOperation] = useState<string>('add');
  const [result, setResult] = useState<number | string>(0);
  const { toast } = useToast();

  const calculateResult = () => {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
    if (isNaN(number1) || isNaN(number2)) {
      toast({
        title: "Neplatná hodnota",
        description: "Zadejte platná čísla",
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
            title: "Chyba",
            description: "Nelze dělit nulou",
            variant: "destructive"
          });
          calculatedResult = "Chyba: Dělení nulou";
        } else {
          calculatedResult = number1 / number2;
        }
        break;
      default:
        calculatedResult = 0;
    }
    
    setResult(calculatedResult);
    
    toast({
      title: "Výpočet dokončen",
      description: `Výsledek: ${calculatedResult}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Základní kalkulačka</CardTitle>
          </div>
          <CardDescription>
            Jednoduchá kalkulačka pro základní matematické operace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="num1">První číslo</Label>
            <Input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operation">Operace</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger id="operation">
                <SelectValue placeholder="Vyberte operaci" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Sčítání (+)</SelectItem>
                <SelectItem value="subtract">Odčítání (-)</SelectItem>
                <SelectItem value="multiply">Násobení (×)</SelectItem>
                <SelectItem value="divide">Dělení (÷)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="num2">Druhé číslo</Label>
            <Input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
            />
          </div>
          
          <Button onClick={calculateResult} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Vypočítat
          </Button>
          
          <div className="p-4 bg-muted rounded-md text-center">
            <div className="text-sm font-medium">Výsledek:</div>
            <div className="text-3xl font-bold">{result}</div>
          </div>
        </CardContent>
      </Card>
      
      <CrossBorderTaxCalculator />
    </div>
  );
};

export default BasicCalculator;
